
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/coffeeDB");

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

const coffee = new Coffee({
    name:"lattee",
    price:5,
    quantity:25
});

// coffee.save();

const pastrySchema = new mongoose.Schema({
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
    bestcoffeecompany:coffeeSchema
});

const Pastry= mongoose.model("Pastry",pastrySchema);

const mocha = new Coffee({
    name:"mocha",
    price:6,
    quantity:20
});

mocha.save();


const pastry = new Pastry({
    name:"sourdough",
    price:8,
    quantity:10,
    bestcoffeecompany:mocha
});

pastry.save();

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

Coffee.insertMany([lattee,flatwhite,espresso,longblack],function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Successfully saved all the coffees to coffeeDB");
    }
});

Coffee.find(function(err,coffees){
    if(err){
        console.log(err);
    }else{
        // console.log(coffees);

        mongoose.connection.close();

        coffees.forEach(function(coffee){
            console.log(coffee.name);
        })
    }
});

Coffee.updateOne({_id:"61dd24476c56ce143f9535c4"},{name:"cold brew"},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("successfully!");
    }
});

Coffee.deleteOne({name:"lattee"},function(err){
    if(err) {
        console.log(err);
    } else{
        console.log("Successfully deleted the document");
    }
});

Coffee.deleteMany({name:"name:lattee"},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Successfully deleted all the document");
    }
});