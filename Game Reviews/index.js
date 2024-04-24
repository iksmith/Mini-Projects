import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Database Connection
const db = new pg.Client ({
    user : "postgres",
    password : "1213",
    host : "localhost",
    port : 5432,
    database : "game_reviews"
}); 
// Remove Comment when ready for Database
// db.connect();

// Giantbomb.com API Key - No Rate Limits
const API_KEY = "972df4c2f27c4047bad59d46af3c50d92a83d377"
const URL = `URL: https://www.giantbomb.com/api/game/[guid]/?api_key=${API_KEY}&format=json`



app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/create.ejs', (req, res) => {
    res.render('create.ejs');
});

//  Game API: https://www.giantbomb.com/api/documentation/ - Need to validate

// Functions

function searchGame() {
    $('searchInput').addEventListener('input', function(e) {
        let searchGame = e.target.value;
        if (searchGame.length > 2) { // <- This starts search after 2 or more char
            fetch(URL + `&query=${searchGame}&resources=game`)
            .then(response => response.json())
            .then(games => {
                //clear previous results
                $('searchResults').innerHTML = '';
                // Display new results
                games.forEach(game => {
                    let searchResults = $('searchResults');
                    searchResults.textContent = game.name; // Displays Game Name
                    searchResults.appendchild(searchResults);
                });
            });
        } 
    });
}



// Call Funciton to Search for Game Here


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
