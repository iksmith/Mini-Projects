import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";


const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    database : "gameApp" // Must be the same as DB
}); 

db.connect(err => {
    if (err) {
        console.error('Error connecting to Database: ', err.stack)
    } else {
        console.log('Connected to database')
    }
});

// Giantbomb.com API Key - No Rate Limits
const API_KEY = "972df4c2f27c4047bad59d46af3c50d92a83d377"

//Giant Bomb API URL
const URL = `URL: https://www.giantbomb.com/api/games/[guid]/?api_key=${API_KEY}&format=json` // I changed this from game to games. May want to confirm the difference
const gameCoverURL = `/image`;
const gameTitleURL = `/name`;
const gameTitle = [];
const gameCover = [];

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/create.ejs', (req, res) => {
    res.render('create.ejs');
});



// Getting Game Function
async function getGameInfo(gameTitleURL) {
    try {
        const response = await axios.get(`https://www.giantbomb.com/api/search/?api_key=${API_KEY}&format=json&query=${gameTitleURL}&resources=game`);
        const games = response.data.results;

        console.log(games);

        if (games.length > 0) {
            return games.map(game => {

                const coverArt = game.image && game.image.thumb_url ? game.image.thumb_url : null;

                return {
                    name: game.name,
                    cover: coverArt
                };
            });
        } else {
            return []; // No results found
        }

    } catch (error) {
        console.error(`Error fetching game info: `, error);
        return [];
    };
}

getGameInfo(`Among Us`);


// Search Function
app.get('/search', (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json(
            {
                error: 'Search term required'
            }
        );
    }
    const query = `
    SELECT * FROM games
    Where name LIKE ?
    `;
    // Partial Matches with %
    const searchValue = `%${searchTerm}%`;
    db.query(query, [searchValue, searchValue],
        (err, results) => {
            if (err) {
                console.error(`Error executing search query: `,  err.stack);
                return res.status(500).json (
                    {
                        error: 'Internal Server Error'
                    }
                );
            }
            res.json(results);
        }
    );
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
