require('waitjs');

const Descuentos = require('./crawlers/Descuentos');
const Nuevos = require('./crawlers/Nuevos');
const {mongoose} = require('./db/mongoose');
const {Descuento} = require('./models/Descuentos');
const {Nuevo} = require('./models/Nuevos');

// repeat('1 min', () => {
    Descuentos.DescuentosDelMes('http://yoytec.com/index.php').then((res) => {
        console.log('Nuevos Productos en el mes!');
        // console.log(JSON.stringify(res, null, 4));
        for (var i = 0; i < res.length; i++) {
            var descuento = new Descuento(res[i]);
            descuento.save().then((doc)=>{
                console.log('Upload succesfully of: '+doc);
            },(e)=>{
                console.log(e);
            });
        }
        return Nuevos.NuevosDelMes('http://yoytec.com/index.php');
    }).then((res) => {
        for (var i = 0; i < res.length; i++) {
            var nuevo = new Nuevo(res[i]);
            nuevo.save().then((doc)=>{
                console.log('Upload succesfully of: '+doc);
            },(e)=>{
                console.log(e);
            });
        }
    }).catch((e) => {
        console.log(e);
    });
// });
