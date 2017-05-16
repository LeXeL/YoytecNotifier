const config = require('../config/config');
const nodemailer = require('nodemailer');

const {mongoose} = require('../db/mongoose');
const {Descuento} = require('../models/Descuentos');
const {Nuevo} = require('../models/Nuevos');
const {User} = require('../models/Users');

const transporter = config.transporter;

function enviarCorreo() {
  var html = '';
  var sePuedeEnviar = false;
  let nuevoNoEnviados
  let descuentoNoEnviados
  Nuevo.find({enviado: false}).then((doc) => {
    nuevoNoEnviados = doc;
    return Descuento.find({enviado: false});
  }).then((doc) => {
    descuentoNoEnviados = doc
    if (descuentoNoEnviados.length >= 1) {
      html += '<b>Descuentos Nuevos en la pagina de Yoytec</b>';
      for (var i = 0; i < descuentoNoEnviados.length; i++) {
        html += descuentoNoEnviados[i];
      }
      sePuedeEnviar = true;
    }
    if (nuevoNoEnviados.length >= 1) {
      html += '<b><br><br>Nuevos productos en la pagina de Yoytec</b>';
      for (var i = 0; i < nuevoNoEnviados.length; i++) {
        html += nuevoNoEnviados[i]
      }
      sePuedeEnviar = true;
    }
    if (sePuedeEnviar) {
      var to = '';
      User.find({activo: true}).then((doc) => {
        if (doc) {
          for (var i = 0; i < doc.length; i++) {
            to += doc[i].email + ',';
          }
          let mailOptions = {
            from: '"Yoytec Notifier" <yn@bballoon.net>', // sender address
            to: to, // list of receivers
            subject: 'Yoytec Notifier New Activity', // Subject line
            html: html // html body
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            Nuevo.find({enviado: false}, function(err, doc) {
              if (err) throw err;
              for (var i = 0; i < doc.length; i++) {
                doc[i].enviado = true;
                doc[i].save(function(error) {
                  if (err) throw err;
                })
              }
            });
            Descuento.find({enviado: false}, function(err, doc) {
              if (err) throw err;
              for (var i = 0; i < doc.length; i++) {
                doc[i].enviado = true;
                doc[i].save(function(error) {
                  if (err) throw err;
                })
              }
            });
          });
        }
      });
    }
  }).catch((e) => {
    console.log(e);
  });
}

module.exports={enviarCorreo}
