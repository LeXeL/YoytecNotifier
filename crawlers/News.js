const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

var GetNews = (link)=> {
  let newObj = []
  return new Promise(function(resolve, reject) {
    request(link, (e, res) => {
      if (e) {
        reject('Unable to connect to yoytec server for News')
      }
      var $ = cheerio.load(res.body)
      $('.span2_20').each((i,e)=>{
        var url = e.children[1].children[1].children[0].attribs.href
        var img ='https://yoytec.com/'+e.children[1].children[1].children[0].children[0].attribs.src
        var name = e.children[1].children[1].children[0].children[0].attribs.title
        if (e.children[1].children[7].type === "text"){
            var price = e.children[1].children[8].children[5].children[1].children[1].children[1].children[0].data
        }else{
          if(e.children[1].children[7].attribs.class === 'manufacturer_logo'){
            var price = e.children[1].children[9].children[5].children[1].children[1].children[1].children[0].data
          }else{
            var price = e.children[1].children[7].children[5].children[1].children[1].children[1].children[0].data
          }
        }
        var news = {
              name,
              img,
              url,
              price
            }
            newObj.push(news)
      })
      resolve(newObj)
    })
  })

}

module.exports = {
  GetNews
}
