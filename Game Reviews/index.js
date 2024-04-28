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
const API_KEY = "972df4c2f27c4047bad59d46af3c50d92a83d377";
const guid = `/guid`;

//Giant Bomb API URL
const gameTitle = `/name`;
const gameCover = `/image`;
const selectedGame = [];
const selectedArt = [];
const baseURL = `https://www.giantbomb.com/api/games/?api_key=${API_KEY}&format=json`;
const URL = `${baseURL}$fieldList=${fields}`;
const fields = 'name,image';


// Render Home
app.get('/', (req, res) => {
    res.render('index.ejs');
})

// Render back home when clicked. Could also use redirect
app.get('/index', (req, res) => {
    res.render('index.ejs')
})

// Render Create Page
app.get('/create.ejs', (req, res) => {
    res.render('create.ejs');
});




// PORT
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
