const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const StudentModel = require('./models/Student');
const UserModel = require('./models/User');
const config = require('./config/auth.config');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {verifyToken} = require('./authJwt');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://cpriyankara:admin@cluster0.otque.mongodb.net/student-management?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/insert', async (req, res) => {
    // bcrypt.hashSync(req.body.password, 8)
    const student = new StudentModel({name: req.body.name, age: req.body.age, degree: req.body.degree});
    await student.save();
    res.send('Inserted data');
});

app.get('/get-all', (req, res) => {
    verifyToken(req,res, async () => {
        await StudentModel.find({}, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });
});

app.put('/update', async (req, res) => {
    const newName = req.body.newName;
    const id = req.body.id;
    try {
        // await StudentModel.findByIdAndUpdate({_id:id},{name:newName})
        await StudentModel.findById(id, (error, studentToUpdate) => {
            studentToUpdate.name = newName;
            studentToUpdate.save();
        });
    } catch (err) {
        console.log(err);
    }
    res.send('Updated');
});

app.delete('/delete/:id', async (req, res) => {
    await StudentModel.findByIdAndDelete(req.params.id).exec();
    res.send("Student Removed.");
});

app.post('/login', async (req, res) => {
    const uname = req.body.username['username'];
    const pwd = req.body.password['password'];
    await UserModel.findOne({username: uname}, (err, user) => {
        if(err) {
            return res.status(500).send({message:err});
        }
        if(!user) {
            return res.status(404).send({message:'User not found.'});
        }
        let isPasswordValid = bcrypt.compareSync(
            user.password,
            pwd
        );
        let token = jwt.sign({id:user._id}, config.secret, {
            expiresIn:86400
        });
        res.status(200).send({
            id:user._id,
            token:token
        });

    });
});

app.listen(3001, () => {
    console.log("Server is listening");
});