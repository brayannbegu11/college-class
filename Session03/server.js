const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const path = require("path");

const multer = require("multer");

/*
use multer.diskStorage() to specify the storage location for files and filename
*/
const myStorage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function(req, file, cb){
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
})

//associate the storage config to multer middleware
const upload = multer({storage: myStorage});

// https://www.npmjs.com/package/multer
/*
multer is a middleware that will allow the server to process the data sent by the form
as multipart/form-data

this will be helpful to receive files sent by the user with form data

multer will also allow the server to configure the directory where the files need to be saved
also allows to configure the file name

use the following command to install multer to your project
npm install --save multer
*/

/*
to use/access data sent by form

used to configure express server to interpret the data sent by <form> element
.must be written after app const declaration and before post route that processes the data
*/
app.use(express.urlencoded({ extended: true}))

/*
set the public folder as static directory of server from where the static resources can be loaded
we will use this to save / load the pictures the user has uploaded
*/
app.use(express.static("./public/"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/contact-us", (req, res) => {
  res.sendFile(path.join(__dirname, "contact-us.html"));
});

// app.post("/send-feedback", (req, res) => {
app.post("/send-feedback", upload.single("photo") , (req, res) => {
  console.log("Post request received for feedback");

  //body property from request object will provide the form data sent by HTML page
  // console.log(`req.body : ${req.body}`);

  //JSON.stringify() - to convert JSON object into String representation
  // console.log(`req.body String format : ${JSON.stringify(req.body)}`);

  if (req.body !== undefined){

    /*
    To access form inputs, use the value of name attribute with body property
    For example: 
    for the following input

    <input type="text" placeholder="Enter Player name" name="playerName" />

    use ${req.body.playerName} to access the form data

    */
    console.log(`Name : ${req.body.customerName}`);
    console.log(`Message : ${req.body.customerMessage}`);
    console.log(`Discovery Method : ${req.body.discoveryMethod}`);

    const name = req.body.customerName;
    const discovery = req.body.discoveryMethod;
    const message = req.body.customerMessage;

    //trying to access form field which isn't present on the form
    //return undefined
    console.log(`email : ${req.body.emailAddress}`);

    const formFile = req.file;
    if(req.file === undefined){
      console.log(`photo not provided with form data`);
    }else{
      console.log(`photo will be saved to the public storage`);
    }

    if (discovery === "email"){
      if(formFile === undefined){
        res.send(`Thank you for your feedback ${name}. We appreciate access our email.`)
      }else{
        res.send(`
            <p>Thank you for your feedback ${name}</p>
            <img src = '/photos/${formFile.filename}' />
        `);
      }
    }else if (discovery === "friend"){
      res.send(`You have great friends, ${name}`)
    }else if (discovery === "google"){
      res.send(`${name}, your search engine works hard for you.`)
    }

    // res.send("Form data has been processed");
  }else{

    //operations to perform if the data is not received

    res.send("unable to receive data from form")
  }
});

const onHttpStart = () => {
  console.log(`The web server has started at http://localhost:${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);
