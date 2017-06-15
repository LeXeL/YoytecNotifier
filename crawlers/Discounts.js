const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var GetDiscounts = (url) => {
  return new Promise(function(resolve, reject){
    request(url, (e, res) => {
      if (e) {
        resolve('Unable to connect to yoytec server for Descuentos')
      }else{
        var $ = cheerio.load(res.body)
        var priceOne = []
        var priceTwo = []
        var counter = 0
        var discountsObj = []
        $('.productListingPrice').each((i, e) => {
          priceOne.push(e.children[0].children[0].data)
          priceTwo.push(e.children[0].next.next.children[0].data)
        })
        $('table .productListing-small').each((i, e) => {
          if (e.name === 'td' && e.children[0].name === 'br' && e.children[0].next.name === 'br' && e.children[0].next.next.name === 'a' && e.children[0].next.next.children[0].name === 'img') {
            var name = e.children[0].next.next.children[0].attribs.title
            var img = 'http://yoytec.com/' + e.children[0].next.next.children[0].attribs.src
            var url = e.children[0].next.next.children[0].parent.attribs.href
            var priceBefore = priceOne[counter]
            var priceAfter = priceTwo[counter]
            // console.log(name,img,url)
            var discount = {
              name,
              img,
              url,
              priceBefore,
              priceAfter
            }
            discountsObj.push(discount)
            counter = counter + 1
          }
        })
        resolve(discountsObj)
      }

    })
  })
}

module.exports = {
  GetDiscounts
}
