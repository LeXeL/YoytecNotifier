const config = require('./config/config');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const {StartWebcrawling} = require('./scripts/recrawl');
const routes = require('./routes');

var app = express();
const port = process.env.PORT;

//Set router
app.use('/',routes);

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

// Set Static Folder
app.use(express.static(__dirname + '/public'));

//Start
StartWebcrawling();

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
