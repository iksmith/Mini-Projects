import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";


const app = express();
const port = 3000;


const __dirname = dirname(fileURLToPath(import.meta.url));


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

dotenv.config({ path: `.env.${process.env}` });
dotenv.config();

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
//todo const API_KEY = process.env.API_KEY;
const API_KEY = "972df4c2f27c4047bad59d46af3c50d92a83d377";
console.log("API KEY: ", API_KEY);


//Giant Bomb API URL
const URL = `https://www.giantbomb.com/api/games/[guid]/?api_key=${API_KEY}&format=json`; // I changed this from game to games. May want to confirm the difference
const gameCover = `/image`;
const gameTitle = `/name`;
const gameTitleArr = [];
const gameCoverArr = [];

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/create.ejs', (req, res) => {
    res.render('create.ejs');
});


const fetchGamesAndStore = async () => {
    try {
        const response = await axios.get(URL); // Make sure URL is properly defined elsewhere in your code

        // Loop through each game in the response
        for (const game of response.data.results) {
            await db.query(
                'INSERT INTO games (gameName, coverImage) VALUES ($1, $2)',
                [game.name, game.image.thumb_url] // Assuming game.image.thumb_url is the correct path to the image URL
            );
        }

    } catch (error) {
        console.error('Failed to fetch or store games', error);

    } finally {

        db.end(); // Close db connection
    }
};

fetchGamesAndStore();

// Getting Game Function
async function getGameInfo(gameTitle) {
    try {
        const response = await axios.get(`https://www.giantbomb.com/api/search/?api_key=${API_KEY}&format=json&query=${gameTitle}&resources=game`);
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

getGameInfo(gameTitle);


// Game Search

    app.get('/search-games', async (req, res) => {
        const gameTitle = req.query.title;

        if (!gameTitle) {
            return res.status(400).json({ error: 'Game title required' });
        }

        try {
            const games = await getGameInfo(gameTitle);
            res.json(games);

        } catch (error) {
            console.error('Failed to get game info:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });






// PORT
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
