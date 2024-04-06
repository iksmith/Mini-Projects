import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// View Engine & Directory

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


// Rendering Index EJS HTML File --> Home Page

app.get('/', (req, res) => {
    res.render(`index.ejs`)
})

app.get('/edit', (req, res) => {
    res.render('edit.ejs');
})


app.post("/submit", (req, res)=> {
    const { blogtitle } = req.body;
    res.render(`index.ejs`, { blogTitle });
});

// Port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });