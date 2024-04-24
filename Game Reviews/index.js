import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

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

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/create.ejs', (req, res) => {
    res.render('create.ejs');
});

// Use this API: https://rawg.io/ - Game API - Not working
// Another Game API: https://www.giantbomb.com/api/documentation/ - Need to validate

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
