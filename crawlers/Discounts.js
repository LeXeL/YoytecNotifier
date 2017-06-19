const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var GetDiscounts = (url) => {
  let discountsObj = []
  return new Promise(function(resolve, reject){
    request(url, (e, res) => {
      if (e) {
        resolve('Unable to connect to yoytec server for Descuentos')
      }else{
        var $ = cheerio.load(res.body)
        $('.span2_20').each((i,e)=>{
          var url = e.children[1].children[1].children[0].attribs.href
          var img ='https://yoytec.com/'+e.children[1].children[1].children[0].children[0].attribs.src
          var name = e.children[1].children[1].children[0].children[0].attribs.title
          if (e.children[1].children[7].type === "text"){
            var priceBefore = e.children[1].children[10].children[5].children[1].children[1].children[1].children[0].data
            var priceAfter = e.children[1].children[10].children[5].children[1].children[1].children[1].next.next.children[0].data
          }else{
            if(e.children[1].children[7].attribs.class === 'manufacturer_logo'){
              var priceBefore = e.children[1].children[9].children[5].children[1].children[1].children[1].children[0].data
              var priceAfter = e.children[1].children[9].children[5].children[1].children[1].children[1].next.next.children[0].data
            }else{
              var priceBefore = e.children[1].children[7].children[5].children[1].children[1].children[1].children[0].data
              var priceAfter = e.children[1].children[7].children[5].children[1].children[1].children[1].next.next.children[0].data
            }
          }
          var news = {
                name,
                img,
                url,
                priceBefore,
                priceAfter
              }
              discountsObj.push(news)
        })
        resolve(discountsObj)
      }

    })
  })
}

module.exports = {
  GetDiscounts
}
