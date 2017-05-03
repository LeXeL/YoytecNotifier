const Descuentos = require('./crawlers/Descuentos');
const Nuevos = require('./crawlers/Nuevos');

console.log('Nuevos Productos en el mes!');
Descuentos.DescuentosDelMes('http://yoytec.com/index.php');
console.log('Descuentos agregados!');
Nuevos.NuevosDelMes('http://yoytec.com/index.php');
