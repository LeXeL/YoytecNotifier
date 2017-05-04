require('waitjs');

const Descuentos = require('./crawlers/Descuentos');
const Nuevos = require('./crawlers/Nuevos');


repeat('5 min', () => {
    Descuentos.DescuentosDelMes('http://yoytec.com/index.php').then((res) => {
        console.log('Nuevos Productos en el mes!');
        console.log(JSON.stringify(res, null, 4));
        console.log('Descuentos agregados!');
        return Nuevos.NuevosDelMes('http://yoytec.com/index.php');
    }).then((res) => {
        console.log(JSON.stringify(res, null, 4))
    }).catch((e) => {
        console.log(e);
    });
});
