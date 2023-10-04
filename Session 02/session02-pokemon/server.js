const express = require("express");
const app = express();
// used to automatically access images and css files from the assets/ folder
// without having to write explicit endpoints for each file
app.use(express.static("assets"));

const HTTP_PORT = process.env.PORT || 8080;

// used to send files
const path = require("path");

// used to send a handlebars template back to the client
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// list of pokemon
const pokemonList = [
    {
        name: "Bellsprout",
        type: "grass",
        image: "bellsprout.png",
        attack: 25,
    },
    {
        name: "Bulbasaur",
        type: "grass",
        image: "bulbasaur.png",
        attack: 100,
    },
    {
        name: "Charmander",
        type: "fire",
        image: "charmander.png",
        attack: 45,
    },
    {
        name: "Ditto",
        type: "normal",
        image: "ditto.png",
        attack: 40,
    },
    {
        name: "Eevee",
        type: "normal",
        image: "eevee.png",
        attack: 30,
    },
    {
        name: "Meowth",
        type: "normal",
        image: "meowth.png",
        attack: 80,
    },
    {
        name: "Pikachu",
        type: "electric",
        image: "pikachu.png",
        attack: 10,
    },
    {
        name: "Psyduck",
        type: "water",
        image: "psyduck.png",
        attack: 85,
    },
    {
        name: "Squirtle",
        type: "water",
        image: "squirtle.png",
        attack: 90,
    },
    {
        name: "Secret Unnamed Pokemon",
        type: "fire",
        image: "pokeball.png",
        attack: 55,
    },
];

// --------------------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/show-all", (req, res) => {

    res.render('all', {
        layout: 'pokemon-layout',
        pokemonList
    })
});

app.get("/super", (req, res) => {

    // retrieve all pokemon whose attack > 80
    let results = []
    for (const pokemon of pokemonList) {
        if (pokemon.attack > 80) {
            results.push(pokemon)
        }
    }

    // display the pokemon to the screen
    res.render('super', {
        layout: 'pokemon-layout',
        superPokemons: results
    })
});

app.get("/random", (req, res) => {

    // get the position of the last item in the array
    const n = pokemonList.length - 1

    // generate a value between 0 and n
    const randomPos = Math.floor(Math.random() * n)

    // retrieve the pokemon in the random position
    const selectedPokemon = pokemonList[randomPos]

    // display the pokemon to the screen
    res.render('random', {
        layout: 'pokemon-layout',
        selectedPokemon
    })
});

// --------------------------------
// function
// - this is the function that executes when the web server starts
const onHttpStart = () => {
    console.log("The web server has started...");
    console.log(`Server is listening on port ${HTTP_PORT}`);
    console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);
