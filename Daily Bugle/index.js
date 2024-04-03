import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(`/public`, express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// View Engine & Directory
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

// Rendering Index EJS HTML File --> Home Page

app.get('/', (req, res) => {
    res.render(`index.ejs`)
})

// Port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });