require('waitjs');
require('./config/config.js');
const moment = require('moment');
const express = require('express');
const http = require("http");
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const DescuentosCrawler = require('./crawlers/Descuentos');
const NuevosCrawler = require('./crawlers/Nuevos');
const {mongoose} = require('./db/mongoose');
const {Descuento} = require('./models/Descuentos');
const {Nuevo} = require('./models/Nuevos');
const {User} = require('./models/Users');


var app = express();
const port = process.env.PORT;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lexelEZ@gmail.com',
        pass: 'atletico123!'
    }
});

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

function enviarCorreo() {
    var html = '';
    var sePuedeEnviar = false;
    var nuevoNoEnviados = [];
    var descuentoNoEnviados = [];

    Nuevo.find({enviado:false},function (err, doc) {
        if (err) throw err;
        nuevoNoEnviados = doc;
    });
    Descuento.find({enviado:false},function (err,doc) {
        if(err) throw err;
        descuentoNoEnviados = doc;
    });
    console.log(nuevoNoEnviados);
    if (descuentoNoEnviados.length > 1) {
        html += '<b>Descuentos Nuevos en la pagina de Yoytec</b>';
        for (var i = 0; i < descuentoNoEnviados.length; i++) {
            html += descuentoNoEnviados[i];
        }
        sePuedeEnviar = true;
        // Descuento.find({
        //     enviado: false
        // }, function(err, doc) {
        //     if (err) throw err;
        //     for (var i = 0; i < doc.length; i++) {
        //         doc[i].enviado = true;
        //         doc[i].save(function(error) {
        //             if (err) throw err;
        //         })
        //     }
        // })
    }
    if (nuevoNoEnviados) {
        html += '<b> Nuevos productos en la pagina de Yoytec</b>';
        for (var i = 0; i < nuevoNoEnviados.length; i++) {
            html += nuevoNoEnviados[i]
        }
        sePuedeEnviar = true;
        // Nuevo.find({
        //     enviado: false
        // }, function(err, doc) {
        //     if (err) throw err;
        //     for (var i = 0; i < doc.length; i++) {
        //         doc[i].enviado = true;
        //         doc[i].save(function(error) {
        //             if (err) throw err;
        //         })
        //     }
        // })
    }
    console.log('Se puede enviar? ' + sePuedeEnviar);
    if (sePuedeEnviar) {
        let mailOptions = {
            from: '"Yoytec Notifier" <lexelEZ@gmail.com>', // sender address
            to: 'diego.r2892@gmail.com', // list of receivers
            subject: 'Yoytec Notifier New Activity', // Subject line
            html: html // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

}



enviarCorreo();


repeat('10s', () => {
    setInterval(function() {
        http.get("http://vast-waters-28879.herokuapp.com");
    }, 300000);
    var now = moment()
    var formatted = now.format('YYYY-MM-DD HH:mm:ss')
    var dia = moment().format('dddd');
    var hora = moment().format('HH');
    var minuto = moment().format('mm');
    // // console.log(parseInt(hora),parseInt(minuto,10));
    // if (dia === 'Wednesday' || dia === 'Friday') {
    //     if (parseInt(hora, 10) === 9 && parseInt(minuto, 10) <= 20) {
    //         enviarCorreo();
    //     }
    // }
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
