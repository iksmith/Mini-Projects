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



// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

// Add a closing parenthesis here

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
