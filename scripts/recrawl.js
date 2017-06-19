require('waitjs')
require('dotenv').config()
const config = require('../config/config')
const moment = require('moment')
const request = require('request')

const DiscountCrawler = require('../crawlers/Discounts')
const NewsCrawler = require('../crawlers/News')
const {sendEmail} = require('./sendEmail')
const {mongoose} = require('../db/mongoose')
const {Discount} = require('../models/Discounts')
const {NewItems} = require('../models/News')
const {User} = require('../models/Users')

function StartWebcrawling() {
    repeat(process.env.WAIT_TIME, () => {
        request('http://yn.bballoon.net',(e,res)=>{if(e) console.log(e)})
        var now = moment()
        var formatted = now.format('YYYY-MM-DD HH:mm:ss')
        var day = moment().format('dddd')
        var hour = moment().format('HH')
        var minute = moment().format('mm')
        if (day === 'Tuesday' || day === 'Friday') {
            if (parseInt(hour, 10) === 9 && parseInt(minute, 10) <= 20) {
                sendEmail()
            }
        }
        sendEmail()
        console.log('[' + formatted + '] Rescaning for new items!')
        DiscountCrawler.GetDiscounts('https://www.yoytec.com/specials.php').then((res) => {
            for (var i = 0; i < res.length; i++) {
                var discount = new Discount(res[i])
                Discount.checkifnew(discount).then((doc) => {
                    doc.save()
                    console.log('Upload succesfully on Discount: ' + doc)
                }).catch((e) => {

                })
            }
            return NewsCrawler.GetNews('https://www.yoytec.com/products_new.php').then((res) => {
                for (var i = 0; i < res.length; i++) {
                    var newItem = new NewItems(res[i])
                    NewItems.checkifnew(newItem).then((doc) => {
                        doc.save()
                        console.log('Upload succesfully on New: ' + doc)
                    }).catch((e) => {

                    })
                }
            }).catch((e) => {
            console.log(e)
        })
      })
    })
}

module.exports = {StartWebcrawling}
