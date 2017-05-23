require('waitjs');
const config = require('../config/config');
const moment = require('moment');
const http = require("http");

const DescuentosCrawler = require('../crawlers/Descuentos');
const NuevosCrawler = require('../crawlers/Nuevos');
const {sendEmail} = require('./sendEmail');
const {mongoose} = require('../db/mongoose');
const {Descuento} = require('../models/Descuentos');
const {Nuevo} = require('../models/Nuevos');
const {User} = require('../models/Users');

function StartWebcrawling() {
    repeat('10m', () => {
        setInterval(function() {
            http.get("http://vast-waters-28879.herokuapp.com");
        }, 300000);
        var now = moment();
        var formatted = now.format('YYYY-MM-DD HH:mm:ss');
        var day = moment().format('dddd');
        var hour = moment().format('HH');
        var minute = moment().format('mm');
        if (day === 'Wednesday' || day === 'Friday') {
            if (parseInt(hour, 10) === 9 && parseInt(minute, 10) <= 20) {
                sendEmail();
            }
        }
        sendEmail();
        console.log('[' + formatted + '] Rescaning for new items!');
        DescuentosCrawler.DescuentosDelMes('http://yoytec.com/index.php').then((res) => {
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
}

module.exports = {StartWebcrawling}
