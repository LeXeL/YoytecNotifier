const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var GetNews = (url)=> {
  var newObj = []
  return new Promise(function(resolve, reject) {
    request(url, (e, res) => {
      if (e) {
        reject('Unable to connect to yoytec server for News')
      }
      var $ = cheerio.load(res.body)
      $('.name').each((i,e)=>{
        let url = e.children[0].children[0].attribs.href
        let name = e.children[0].children[0].children[0].data
        let price = e.parent
        console.log(price)
      })


      // $('td .smallText').each((i, e) => {
      //   if (e.name === 'td' && e.children[0].name === 'a') {
      //     var img = 'http://yoytec.com/' + e.children[0].children[0].attribs.src
      //     var name = e.children[0].children[0].attribs.title
      //     var url = e.children[0].attribs.href
      //     var price = e.children[0].next.next.next.next.children[0].data
      //     // console.log(name, url, img)
      //     var news = {
      //       name,
      //       img,
      //       url,
      //       price
      //     }
      //     newObj.push(news)
      //   }
      // })
      resolve(newObj)
    })
  })

}

module.exports = {
  GetNews
}
