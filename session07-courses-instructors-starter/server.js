const express = require("express")
const app = express()
const HTTP_PORT = process.env.PORT || 8080


// configure a folder for external css stylesheets and images
app.use(express.static("assets"))

// import handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// receive data from a <form>
app.use(express.urlencoded({ extended: true }))



/// --------------
// DATABASE : Connecting to database and setting up your schemas/models (tables)
/// --------------


// TODO: Replace this connection string with yours
const mongoose = require("mongoose")
const PASSWORD = 'p4DZkiozeuInDUdH'

const CONNECTION_STRING = `mongodb+srv://brayannbegu11:${PASSWORD}@class.i9tipxl.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(CONNECTION_STRING);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => { console.log("Mongo DB connected successfully."); });



// Define the schema and models for our collections
// - schema = mongoose object
// Defines what each individual documents look like

// schemas
const Schema = mongoose.Schema
const CourseSchema = new Schema({ title: String, code: String, taughtBy: String })
const InstructorSchema = new Schema({ firstName: String, lastName: String, email: String, username: String })


// models
const Course = mongoose.model("course_collection", CourseSchema)
const Instructor = mongoose.model("instructor_collection", InstructorSchema)


// ----------------
// endpoints
// ----------------
app.get("/", (req, res) => {
    res.render("index", { layout: false })
})

app.get("/catalogue", async (req, res) => {
    try {
        // gets all Course documents
        const results = await Course.find().lean().exec()
        console.log(results)
        if (results.length === 0) {
            return res.send('ERROR: no courser in the database')
        }

        res.render('catalog-page', {
            layout: false,
            results
        })
    } catch (err) {
        console.log(err)
    }
})



app.post("/lookup", async (req, res) => {

    // get name from form
    const nameFromUI = req.body.instructorName
    console.log(`DEBUG: Searching for ${nameFromUI}`)

    try {
        // search for instructorb,
        const instructors = await Instructor.find({ firstName: nameFromUI }).lean().exec()
        if (instructors.length === 0) {
            return res.send('No instructors found that match the search criteria')
        }

        let data = []
        for (const instructor of instructors) {
            const userId = instructor.username
            const courses = await Course.find({ taughtBy: userId }).lean().exec()

            const objectToAdd = {
                name: `${instructor.firstName} ${instructor.lastName}`,
                email: instructor.email,
                coursesTaught: courses
            }

            data.push(objectToAdd)
        }
        return res.render('instructor-page', {
            layout: false,
            instructors: data
        })
    } catch (error) {
        console.log(error)
    }


})

app.post("/enroll", async (req, res) => {
    // get values from form
    console.log(`DEBUG: Form data`)
    console.log(req.body)
    const courseCodeFromUI = req.body.courseCode
    const useridFromUI = req.body.instructorName


    try {


        // 1. Find the course that you want to modify
        // .find() --> gets all documents and returns an array of objects
        // .findOne() --> get the first document that matches return a single object
        const courseFromDb = await Course.findOne({ code: courseCodeFromUI })


        if (courseFromDb === null) {
            return res.send("ERROR: Could not find matching course")
        }


        // 2. Check if the course has an instructor already
        if (courseFromDb.taughtBy !== "") {
            // the course already has an instructor
            return res.send(`ERROR: Course already has an instructor: ${courseFromDb.taughtBy}`)
        }




        // 3. Search for matching instructor
        const instructorFromDb = await Instructor.findOne({ username: useridFromUI }).lean().exec()


        if (instructorFromDb === null) {
            return res.send("ERROR: Could not find instructor with the specified username")
        }


        // 4. Check if instructor is already teaching the max number of courses
        const coursesTaught = await Course.find({ taughtBy: instructorFromDb.username }).lean().exec()
        if (coursesTaught.length === 3) {
            return res.send("ERROR: This instructor is already at the max number of courses")
        }
        // 5. If you reach this point, the instructor can be assigned
        const updatedValues = {
            taughtBy: instructorFromDb.username
        }
        // 3. after updating, save changes
        const finalResult = await courseFromDb.updateOne(updatedValues)
        // TODO :ERROR CHECKING
        return res.send("DONE!!!!!")


    } catch (error) {
        console.error(error)
    }
})





// ----------------
const onHttpStart = () => {
    console.log(`Express web server running on port: ${HTTP_PORT}`)
    console.log(`Press CTRL+C to exit`)
}
app.listen(HTTP_PORT, onHttpStart)
