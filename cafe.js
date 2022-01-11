//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/coffeeDB", {useNewUrlParser: true});

app.get("/location", function(req, res){
    res.render("location");
});

app.get("/shopping-cart", function(req, res){
    res.render("shopping-cart");
});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

    Post.find({}, function(err, posts){
        res.render("home", {
            posts: posts
        });
    });
});


app.get("/compose", function(req, res){
    res.render("compose");
});

app.post("/compose", function(req, res){
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    post.save(function(err){
        if (!err){
            res.redirect("/");
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

const coffeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please check your name entry,no name specified!"]
    },
    price:Number,
    quantity:{
        type:Number,
        min:1,
        max:100
    },
});

const Coffee = mongoose.model("Coffee",coffeeSchema);

const flatwhite = new Coffee({
    name:"flat white",
    price:5.5,
    quantity:30
});

const espresso = new Coffee({
    name:"espresso",
    price:4,
    quantity:100
});

const longblack = new Coffee({
    name:"long black",
    price:4.5,
    quantity:50
});

const listSchema = {
    name: String,
    items: [coffeeSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/shop", function(req, res) {
    Coffee.find({}, function(err, foundItems){
        if (foundItems.length === 0) {
            Coffee.insertMany([flatwhite,espresso,longblack],function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully saved all the coffees to coffeeDB");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err, foundList){
        if (!err){
            if (!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: [flatwhite,espresso,longblack]
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show an existing list

                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Coffee({
        name: itemName
    });

    if (listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Coffee.findByIdAndRemove(checkedItemId, function(err){
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


app.listen(8080, function() {
    console.log("Server started on port 8080");
});
