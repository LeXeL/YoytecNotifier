require('waitjs');
require('./config/config.js');
const moment = require('moment');
const express = require('express');
const http = require("http");


const DescuentosCrawler = require('./crawlers/Descuentos');
const NuevosCrawler = require('./crawlers/Nuevos');
const {mongoose} = require('./db/mongoose');
const {Descuento} = require('./models/Descuentos');
const {Nuevo} = require('./models/Nuevos');

var app = express();
const port = process.env.PORT;

app.get('/',(req,res)=>{
    res.send('App is running!');
});

repeat('10m', () => {
    setInterval(function() {http.get("http://vast-waters-28879.herokuapp.com");}, 300000);
  var now = moment()
  var formatted = now.format('YYYY-MM-DD HH:mm:ss')
  console.log('[' + formatted + '] Rescaning for new items!')
  DescuentosCrawler.DescuentosDelMes('http://yoytec.com/index.php').then((res) => {
    // console.log(JSON.stringify(res,null,4));
    for (var i = 0; i < res.length; i++) {
      var descuento = new Descuento(res[i]);
      Descuento.checkifnew(descuento).then((doc) => {
        doc.save();
        console.log('Upload succesfully on Descuento: '+doc);
      }).catch((e) => {

      });
    }
    return NuevosCrawler.NuevosDelMes('http://yoytec.com/index.php').then((res) => {
      for (var i = 0; i < res.length; i++) {
        var nuevo = new Nuevo(res[i]);
        Nuevo.checkifnew(nuevo).then((doc) => {
          console.log(doc);
          doc.save();
          console.log('Upload succesfully on Nuevo: '+doc);
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
