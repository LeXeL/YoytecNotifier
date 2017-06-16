require('waitjs')
require('dotenv').config()
const config = require('../config/config')
const moment = require('moment')
const http = require("http")

const DiscountCrawler = require('../crawlers/Discounts')
const NewsCrawler = require('../crawlers/News')
const {sendEmail} = require('./sendEmail')
const {mongoose} = require('../db/mongoose')
const {Discount} = require('../models/Discounts')
const {NewItems} = require('../models/News')
const {User} = require('../models/Users')

function StartWebcrawling() {
    repeat(process.env.WAIT_TIME, () => {
        setInterval(function() {
            http.get("http://vast-waters-28879.herokuapp.com") //TENGO Que cambiarlo a request
        }, 300000)
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
        // DiscountCrawler.GetDiscounts('http://yoytec.com/index.php').then((res) => {
        //     for (var i = 0; i < res.length; i++) {
        //         var discount = new Discount(res[i])
        //         Discount.checkifnew(discount).then((doc) => {
        //             doc.save()
        //             console.log('Upload succesfully on Discount: ' + doc)
        //         }).catch((e) => {
        //
        //         })
        //     }
        NewsCrawler.GetNews('https://www.yoytec.com/products_new.php').then((res) => {
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
}

module.exports = {StartWebcrawling}
