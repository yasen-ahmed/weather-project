// The project file `index.js` should require express().
let express = require("express");

// Server package
let http = require("http");

// Body parser package
const bodyParser = require('body-parser');

// CORS package
const cors = require('cors');
const { exit } = require("process");

// To load environment variables
require('dotenv').config();

// To make sure the port is set.
if (!process.env.PORT) {
    throw "Please set the PORT in environment variables";
}

// The main storage object
let storage = {};

// should create an instance of their app using express.
let app = express();

// Create app server.
app.server = http.createServer(app);

// Configuring body-parser for URL Params
app.use(bodyParser.urlencoded({extended: false}));

// Configuring body-parser for json bodies
app.use(bodyParser.json());

// Configuring CORS package with app
app.use(cors());

// The Express app instance should be pointed to the project folder with .html, .css, and .js files.
app.use(express.static('website'));

// POST `/add` handler
let addDataHandler = (req, res) => {
    storage = {
        "date": req.body.date,
        "temp": req.body.temp,
        "content": req.body.content
    }
    res.json(storage);
}
app.post('/add', addDataHandler);

// GET `/all` handler
let getDataHandler = (req, res) => {
    res.json(storage);
}
app.get('/all', getDataHandler);

// Configuring the app to listen on configurable port
app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`)
});
