const express = require("express");
const app = express();
// OPTIONAL: 
app.use(express.static("assets"))

const HTTP_PORT = process.env.PORT || 8080;
// OPTIONAL: used if you are sending files back to the client
const path = require("path")
const multer = require("multer");

/*
use multer.diskStorage() to specify the storage location for files and filename
*/
const myStorage = multer.diskStorage({
    destination: "./public/photos/",
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

//associate the storage config to multer middleware
const upload = multer({ storage: myStorage });

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
// Used to configure express server to interpret the data sent by <Form> Element
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/contact_us", (req, res) => {
    res.sendFile(path.join(__dirname, "contact_us.html"));
});

app.post("/send-feedback", upload.single("photo"), (req, res) => {
    console.log("Post request received for feedback");

    if (req.body !== undefined) {
        const { file, customerName, customerMessage, discoveryMethod } = req.body
        console.log('Name:', customerName)
        console.log('Message:', customerMessage)
        console.log('Discovery Method:', discoveryMethod)
        console.log('File:', file)
        res.send('form data has been processed')
    } else {
        res.send('Unable to receive data')

    }

})

const onHttpStart = () => {
    console.log("The web server has started...");
    console.log(`Server is listening on port ${HTTP_PORT}`);
    console.log("Press CTRL+C to stop the server.");
};


app.listen(HTTP_PORT, onHttpStart);
