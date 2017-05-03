const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

function NuevosDelMes(url) {
    var NuevosdelMes = [];
    request(url, (e, res) => {
        var $ = cheerio.load(res.body);
        $('td .smallText').each((i, e) => {
            if (e.name === 'td' && e.children[0].name === 'a') {
                var img = 'http://yoytec.com/' + e.children[0].children[0].attribs.src;
                var name = e.children[0].children[0].attribs.title;
                var url = e.children[0].attribs.href;
                var precio = e.children[0].next.next.next.next.children[0].data;

                // console.log(name, url, img);
                var Nuevo = {
                    name,
                    img,
                    url,
                    precio
                }
                NuevosdelMes.push(Nuevo);
            }
        });
        console.log(NuevosdelMes);
    });
}

module.exports = {
    NuevosDelMes
};
