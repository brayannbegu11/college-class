const express = require("express");
const app = express();

// OPTIONAL: app.use(express.static("assets"))
const HTTP_PORT = process.env.PORT || 8080;
// OPTIONAL: used if you are sending files back to the client
const path = require("path")


// import handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

const students = [
    { name: "Peter", age: 25 },
    { name: "Karen", age: 83 },
    { name: "Louise", age: 17 },
    { name: "Chris", age: 80 },
    { name: "Louise", age: 35 },
    { name: "Louise", age: 22 },
]


app.get("/", (req, res) => {

    const legalStudents = []

    for (const student of students) {
        if (student.age >= 25) {
            legalStudents.push(student)
        }
    }

    for (const student of students) {
        if (student.age >= 25) {
            student.info = 'You can vote!'
        } else {
            student.info = 'Sorry, you must wait'
        }
    }

    res.render('test-template', {
        layout: false,
        myName: 'Brayann',
        myAge: '🙃',
        // testScores: [100, 90, 35]
        legalStudents,
        students
    })
});


const onHttpStart = () => {
    console.log("The web server has started...");
    console.log(`Server is listening on port ${HTTP_PORT}`);
    console.log("Press CTRL+C to stop the server.");
};


app.listen(HTTP_PORT, onHttpStart);

