const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// ---- CONNECT YOUR DATABASE -------

// 1. MongoAtlas connection string
const mongoose = require("mongoose");
// TODO: Replace this with your mongodb connection string
// The mongodb connection string is in the MongoAtlas web interface

const CONNECTION_STRING =
  "mongodb+srv://dbUser:sECRd7i5L8Gfvzch@cluster0.khprnfy.mongodb.net/myDb?retryWrites=true&w=majority";
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
const studentSchema = new Schema({
  name: String,
  username: String,
  tuitionPaid: Boolean,
  gpa: Number,
});
// mongoose MODEL object
// - properties & functions to operate on a collection
// - "students" collection
// - MongoDB will autoamtically add a "s" to the end
// of all your collection names
// & so when you use it programatically, you ahve to remove that "s"
const Student = mongoose.model("student", studentSchema);

/// -------------------------------

app.get("/", async (req, res) => {
  try {
    // query the database and get everything in the 
    // "students" collection
    // .lean().exec()
    // - .lean() - convert the monogoose BSON format into standard
    // javascript objects 
    // - .exec() - run the query
    // const results = await Student.find().lean().exec();

    // gpa < 3
    // lt = less than
    // $lt = mongo query operator
    const results = await Student.find().lean().exec()




    // results = an array of matching documents
    if (results.length === 0) {
      return res.send("Sorry, there are no matching results");
    } else {
      return res.send(results);
    }
  } catch (err) {
    console.log(err);
    return res.send(err)
  }
});

// insert data into the collection
app.get("/insert", async (req, res) => {
    // 1. Define the new student you want to insert
    const studentToInsert = new Student({name:"Betty", "username":"betty108", tuitionPaid:false, gpa:2.1})

    // 2. Try (Attempt) to insert it
    // -possibility of success, possibility of failure
    try {
        // attempt to execute the code in the try{}
        // .save() --> connect to the database and attempt to insert this document into the collection 
        // .save() 
        //      --> if your insert was successful, .save() will return a copy of the document that was inserted
        //      --> if your insert didn't work, then .save() will return "null"
        
        const result = await studentToInsert.save()
        if (result === null) {
            res.send()
            
        }
        else {
            // return = STOP execution at this point
            // exit the function            
            return res.send("Hello!")
        }

        console.log("here is some code")
        res.send("Goodbye")
        

    } catch (err) {
        // if there are errros / failure
        // then the code execution will stop and then
        // the cod will jump to the catch{} block
        console.log(err)        // output the cause of the failure / error
        return res.send(err)

    }

})

app.get("/delete", async (req, res) => {
    // attempt
    try {
        // 1. get the document by id that you want to delete
        const userToDelete = await Student.findOne({_id:"651b6821da0ec4f2feb5f2da"})

        // if no matching document can be found, then exit
        if (userToDelete === null) {
            return res.send("Cannot find student with the specified id")
        }
        
        // 2. otherwise if you can find document,  delete it
        const result = await userToDelete.deleteOne()

        return res.send(`Deleted item is: ${result}`)

    } catch (err) {
        // display error message in browser & console
        console.log(err)
        return res.send(err) 
    }
})

// http://localhost:8080/deleteWithId/sdfsdfsdfsdf
// http://localhost:8080/deleteWithId/651b6820da0ec4f2feb5f2d8
app.get("/deleteWithId/:id", async (req, res) => {
    console.log("DEBUG: Url parameters are:")
    console.log(req.params)
    
    // attempt
    try {
        // 1. get the document by id that you want to delete
        const userToDelete = await Student.findOne({_id:req.params.id})

        // if no matching document can be found, then exit
        if (userToDelete === null) {
            return res.send("Cannot find student with the specified id")
        }
        
        // 2. otherwise if you can find document,  delete it
        const result = await userToDelete.deleteOne()

        return res.send(`Deleted item is: ${result}`)

    } catch (err) {
        // display error message in browser & console
        console.log(err)
        return res.send(err) 
    }
})

app.get("/update", async (req, res) => {

    // attempt to update
    try {
        // 1. find the document you want to update
        const studentToUpdate = await Student.findOne({_id:"651b6774f46e8c0037707455"})

        // if findOne() succeeds, it will contain a document with the appropriate values
        // if findOne() fails, it will return {}

        // TODO: cannot find someone with this id
        // you check if findOne == {}        
        if (studentToUpdate === null) {
            return res.send("Cannot find student with this id")
        }

        // 2. update the student
        const updatedValues = {
            name:"Betty Jones Smith",
            gpa:4.0,
            username:"bjsmith"
        }
        
        // 3. after updating, save changes
        const result = await studentToUpdate.updateOne(updatedValues)

        
        if (result !== null) {
            console.log(result)
            return res.send(`Record updated!`)
            
        }
        else {
            return res.send("Sorry, update failed.")
        }

    } catch(err) {
        return res.send(err)
    }
})

app.get("/updateWithId/:id", async (req, res) => {

    // attempt to update
    try {
        // 1. find the document you want to update
        const studentToUpdate = await Student.findOne({_id:req.params.id})

        // cannot find someone with this id
        if (studentToUpdate === null) {
            return res.send("Cannot find student with this id")
        }

        // 2. update the student
        const updatedValues = {
            name:"Betty Jones Smith",
            gpa:4.0,
            username:"bjsmith"
        }
        
        // 3. after updating, save changes
        const result = await studentToUpdate.updateOne(updatedValues)

        if (result !== null) {
            console.log(result)
            return res.send(`Record updated!`)
            
        }
        else {
            return res.send("Sorry, update failed.")
        }

    } catch(err) {
        return res.send(err)
    }
})






const onHttpStart = () => {
  console.log(`Express web server running on port: ${HTTP_PORT}`);
  console.log(`Press CTRL+C to exit`);
};

app.listen(HTTP_PORT, onHttpStart);
