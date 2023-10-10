const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("assets"))

// import handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// receive data from a <form>
app.use(express.urlencoded({ extended: true }))

// ---- CONNECT YOUR DATABASE -------

// 1. MongoAtlas connection string
const mongoose = require("mongoose")
const PASSWORD = 'p4DZkiozeuInDUdH'

const CONNECTION_STRING = `mongodb+srv://brayannbegu11:${PASSWORD}@class.i9tipxl.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(CONNECTION_STRING);
// check if connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
    console.log("Mongo DB connected successfully.");
});
// --------------------------------

// Setup your database models

const Schema = mongoose.Schema;
const bookSchema = new Schema({
    title: String,
    author: String,
    image: String,
    borrowedBy: String,
});
const userSchema = new Schema({
    name: String,
    cardNumber: String,
    phoneNumber: Boolean,
});
// mongoose MODEL object
// - properties & functions to operate on a collection
// - "students" collection
// - MongoDB will autoamtically add a "s" to the end
// of all your collection names
// & so when you use it programatically, you ahve to remove that "s"
const Book = mongoose.model("books_collection", bookSchema);
const User = mongoose.model("users_collection", userSchema);

app.get("/", (req, res) => {
    res.render('login', {
        layout: 'header'
    })
})


const onHttpStart = () => {
    console.log(`Express web server running on port: ${HTTP_PORT}`)
    console.log(`Press CTRL+C to exit`)
}
app.listen(HTTP_PORT, onHttpStart)