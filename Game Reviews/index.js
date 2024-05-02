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


//Open Critic API
const options = {
  method: 'GET',
  url: 'https://opencritic-api.p.rapidapi.com/game/search',
  params: {
    criteria: 'the witcher 3'
  },
  headers: {
    'X-RapidAPI-Key': 'af3230273emshdd8df12353f7329p16f904jsn4bd0a0ff911e',
    'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}


// PORT
    app.listen(port, () => {
        console.log(`Server running successfully on: http://localhost:${port}`);
    });
