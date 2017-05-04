const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var DescuentosDelMes = (url) => {
  return new Promise(function(resolve, reject){
    request(url, (e, res) => {
      if (e) {
        resolve('Unable to connect to yoytec server for Descuentos');
      } else{
        var $ = cheerio.load(res.body);
        var precio1 = [];
        var precio2 = [];
        var ii = 0;
        var DescuentosDelMes = [];
        $('.productListingPrice').each((i, e) => {
          precio1.push(e.children[0].children[0].data);
          precio2.push(e.children[0].next.next.children[0].data);
        });
        $('table .productListing-small').each((i, e) => {
          if (e.name === 'td' && e.children[0].name === 'br' && e.children[0].next.name === 'br' && e.children[0].next.next.name === 'a' && e.children[0].next.next.children[0].name === 'img') {
            var name = e.children[0].next.next.children[0].attribs.title;
            var img = 'http://yoytec.com/' + e.children[0].next.next.children[0].attribs.src;
            var url = e.children[0].next.next.children[0].parent.attribs.href;
            var precioanterior = precio1[ii]
            var precionuevo = precio2[ii]
            // console.log(name,img,url);
            var Descuento = {
              // id: ii,
              name,
              img,
              url,
              precioanterior,
              precionuevo
            }
            DescuentosDelMes.push(Descuento);
            ii = ii + 1;
          }
        });
        resolve(DescuentosDelMes);
      }

    });
  });
}

module.exports = {
  DescuentosDelMes
};
