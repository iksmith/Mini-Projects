import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';
import methodOverride from 'method-override';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// View Engine & Directory

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//Article Array
const articles = [];

// Rendering Index EJS HTML File --> Home Page

app.get('/', (req, res) => {
    res.render(`index.ejs`, {articles: articles});
})

app.get('/edit/:id', (req, res) => {
    const article = articles.find(article => article.id === req.params.id); // finds article by UUID

    if (article) {
        res.render(`edit`, { article: article});
    } else {
        res.status(404).send(`Article not found`);
    }
});

//Route for creating new article
app.get(`/new-article`, (req, res) => {
    res.render(`edit`, { article: {} });
})

app.post(`/update/:id`, (req, res) => {
    const index = articles.findIndex(article => article.id === req.params.id); // Finding index of article

    if (index !== -1) {
        articles[index].title = req.body.aTitle;
        articles[index].content = req.body.aTxt;
        res.redirect(`/`);
    } else {
        res.status(404).send(`Article not found`);
    }
});


// Parsing Article Title and Content
app.post("/publish", (req, res)=> {
    let aTitle = req.body.aTitle;
    let aTxt = req.body.aTxt;
    console.log(aTitle)
    // console.log(aTxt)

    const articleObj = {
        id: uuidv4(), // Generate unique ID
        title: aTitle,
        content: aTxt
    }

    articles.push(articleObj);
    console.log(articles);

    res.redirect('/');
});

// Delete Route
app.post('/delete/:id', (req, res) => {
    //delete function
    const { id } = req.params;
    const index = articles.findIndex(article => article.id === id);

    if (index !== -1) {
        articles.splice(index, 1); //removing article from array
        res.redirect(`/`);
    } else {
        res.status(404).send(`Article not found`);
    }
});

// Port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });