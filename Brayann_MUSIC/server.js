const express = require("express");
const app = express();
app.use(express.static("assets"))
const HTTP_PORT = process.env.PORT || 8080;

const path = require("path")

app.use(express.urlencoded({ extended: true }))

const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

const music = [
    {
        title: 'After dark',
        artist: 'Mr kitty',
        artistImage: 'mr_kitty.jpeg',
        id: '1'
    },
    {
        title: 'Astronaut in the Ocean',
        artist: 'Masked wold',
        artistImage: 'masked_wolf.jpeg',
        id: '2'
    },
    {
        title: 'Lose yourself',
        artist: 'Eminem',
        artistImage: 'eminem.jpeg',
        id: '3'
    },
    {
        title: 'Otra noche en miami',
        artist: 'Bad bunny',
        artistImage: 'bad_bunny.jpeg',
        id: '4'
    },
]

const playlist = []

app.get("/", (req, res) => {
    res.render('songs', {
        layout: 'header-layout',
        music
    })
});


app.post('/add/:id', (req, res) => {
    if (req.body !== undefined) {
        const songId = req.params.id

        for (const song of music) {
            if (songId === song.id) {
                playlist.push(song)
                res.redirect('/playlist')
            }
        }

    }
})
app.post('/remove/:id', (req, res) => {
    if (req.body !== undefined) {
        const songId = req.params.id

        for (let i = playlist.length - 1; i >= 0; i--) {
            if (playlist[i].id === songId) {
                playlist.splice(i, 1);
            }
        }
        res.redirect('/playlist')
    }

})

app.get("/playlist", (req, res) => {
    res.render('playlist', {
        layout: 'header-layout',
        playlist
    })
});

const onHttpStart = () => {
    console.log("The web server has started...");
    console.log(`Server is listening on port ${HTTP_PORT}`);
    console.log("Press CTRL+C to stop the server.");
};
app.listen(HTTP_PORT, onHttpStart);