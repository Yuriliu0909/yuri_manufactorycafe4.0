//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

//set ejs templates link html&js
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));

//access to public sources for ejs
app.use(express.static("public"));

//mongo atlas connection
mongoose.connect("mongodb+srv://admin_yuri:123@cluster0.peek7.mongodb.net/coffeeDB?retryWrites=true&w=majority", {useNewUrlParser: true});

//blow is tap pages
app.get("/", function(req, res){
    res.render("home");
});

app.get("/location", function(req, res){
    res.render("location");
});

app.get("/comment", function(req, res){
    res.render("comment");
});

//below is shopping methods
const CoffeeSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:[true,"please check your name entry,no name specified!"]
        },
        price: {
            type:Number,
            required: false
        },
        quantity: {
            type:Number,
            required: false
        },
    }
)

const CoffeeModel = mongoose.model('coffees', CoffeeSchema);

const listSchema = {
    name: String,
    items: [CoffeeSchema]
};

const List = mongoose.model("List", CoffeeSchema);

//show default stuff in coffeeDB at shop page
app.get('/shop', async (req, res) => {
    await CoffeeModel.find({}, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.render("list", {listTitle: "Yummy Coffees", newListItems: result});
        }
    });
})

//add new items into db
app.post("/", async function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new CoffeeModel({
        name: itemName
    });

    if (listName === "Yummy Coffees"){
        await item.save();
        res.redirect("/shop");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", async function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    const item = new CoffeeModel({
        name: itemName
    });

    if (listName === "Yummy Coffees") {
        await item.findByIdAndRemove(checkedItemId, function(err){
            if (!err) {
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if (!err){
                res.redirect("/" + listName);
            }
        });
    }
});




//below is post methods
const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/community", function(req, res){
    Post.find({}, function(err, posts){
        res.render("community", {
            posts: posts
        });
    });
});

app.post("/comment", function(req, res){
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save(function(err){
        if (!err){
            res.redirect("/community");
        }
    });
});

app.get("/posts/:postId", function(req, res){

    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });
});

//below is apache server
app.listen(8080, function() {
    console.log("Server started on port 8080");
});
