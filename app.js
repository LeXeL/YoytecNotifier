require('waitjs');
require('./config/config.js');
const moment = require('moment');
const express = require('express');
const http = require("http");
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const DescuentosCrawler = require('./crawlers/Descuentos');
const NuevosCrawler = require('./crawlers/Nuevos');
const {mongoose} = require('./db/mongoose');
const {Descuento} = require('./models/Descuentos');
const {Nuevo} = require('./models/Nuevos');
const {User} = require('./models/Users');

var app = express();
const port = process.env.PORT;

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

app.get('/', (req, res) => {
    res.render('beta',{form:true});
});

app.post('/newuser',(req, res)=>{
    var user = new User({email: req.body.email});
    User.createUser(user).then((doc)=>{
        var now = moment()
        var formatted = now.format('YYYY-MM-DD HH:mm:ss')
        console.log('[' + formatted + '] Succesfully added the new user: '+doc);
        res.render('beta',{exito:true})
    }).catch((e)=>{
        console.log(e);
        res.render('beta',{errors:{error:'User already exists on the database'}})
    })
});

repeat('10m', () => {
    setInterval(function() {
        http.get("http://vast-waters-28879.herokuapp.com");
    }, 300000);
    var now = moment()
    var formatted = now.format('YYYY-MM-DD HH:mm:ss')
    console.log('[' + formatted + '] Rescaning for new items!')
    DescuentosCrawler.DescuentosDelMes('http://yoytec.com/index.php').then((res) => {
        // console.log(JSON.stringify(res,null,4));
        for (var i = 0; i < res.length; i++) {
            var descuento = new Descuento(res[i]);
            Descuento.checkifnew(descuento).then((doc) => {
                doc.save();
                console.log('Upload succesfully on Descuento: ' + doc);
            }).catch((e) => {

            });
        }
        return NuevosCrawler.NuevosDelMes('http://yoytec.com/index.php').then((res) => {
            for (var i = 0; i < res.length; i++) {
                var nuevo = new Nuevo(res[i]);
                Nuevo.checkifnew(nuevo).then((doc) => {
                    console.log(doc);
                    doc.save();
                    console.log('Upload succesfully on Nuevo: ' + doc);
                }).catch((e) => {

                });
            }
        });
    }).catch((e) => {
        console.log(e);
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
