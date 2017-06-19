require('dotenv').config();
const config = require('../config/config')
const nodemailer = require('nodemailer')

const { mongoose } = require('../db/mongoose')
const { Discount } = require('../models/Discounts')
const { NewItems } = require('../models/News')
const { User } = require('../models/Users')

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
})

function sendEmail() {
	let html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Demystifying Email Design</title><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body style="margin: 0; padding: 0;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;"><tr><td align="center" bgcolor="#6ec3e0" style="padding: 40px 0 30px 0;"><img src="http://bballoon.net/img/banner.jpg" alt="Creating Email Magic" width="300" height="120" style="display: block;" /></td></tr><tr><td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%">'
	let canSend = false
	let newNotSend
	let discountNotSend
	NewItems.find({send: false}).then((doc) => {
		newNotSend = doc
		return Discount.find({send: false})
	}).then((doc) => {
		discountNotSend = doc
		if (discountNotSend.length >= 1) {
			html += '<tr><td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"><b>Descuentos de Este mes</b></td></tr>'
			for (var i = 0; i < discountNotSend.length; i++) {
				if(i%2 === 0){
					html += `<tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><a href="${discountNotSend[i].url}"><img src="${discountNotSend[i].img}" alt="" width="100%" height="140" style="display: block;" /></a></td></tr><tr><td style="padding: 25px 0 0 0;">${discountNotSend[i].name}</td></tr><tr><td><p style="color: rgb(237, 46, 27); font-family: Arial, sans-serif; font-size: 24px; margin:2px;" align="center"><del>${discountNotSend[i].priceBefore}</del> <span style="color: rgb(0, 0, 0)">${discountNotSend[i].priceAfter}</span></p></td></tr></table></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td width="260" valign="top">`
				}else{
					html += `<td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><a href="${discountNotSend[i].url}"><img src="${discountNotSend[i].img}" alt="" width="100%" height="140" style="display: block;" /></a></td></tr><tr><td style="padding: 25px 0 0 0;">${discountNotSend[i].name}</td></tr><tr><td><p style="color: rgb(237, 46, 27); font-family: Arial, sans-serif; font-size: 24px; margin:2px;" align="center"><del>${discountNotSend[i].priceBefore}</del> <span style="color: rgb(0, 0, 0)">${discountNotSend[i].priceAfter}</span></p></td></tr></table></td></tr></table></td></tr>`

				}
			}
			if(discountNotSend.length%2 !== 0){
				html+='</tr></table></td></tr>'
			}
			canSend = true
		}
		if (newNotSend.length >= 1) {
			html += '<tr><td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"><b>Nuevos Productos Agregados</b></td></tr>'
			for (var i = 0; i < newNotSend.length; i++) {
				if(i%2 === 0){
					html += `<tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><a href="${newNotSend[i].url}"><img src="${newNotSend[i].img}" alt="" width="100%" height="140" style="display: block;" /></a></td></tr><tr><td style="padding: 25px 0 0 0;">${newNotSend[i].name}</td></tr><tr><td><p style="color: rgb(237, 46, 27); font-family: Arial, sans-serif; font-size: 24px; margin:2px;" align="center"><span style="color: rgb(0, 0, 0)">${newNotSend[i].price}</span></p></td></tr></table></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td width="260" valign="top">`
				}else{
					html += `<td width="260" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><a href="${newNotSend[i].url}"><img src="${newNotSend[i].img}" alt="" width="100%" height="140" style="display: block;" /></a></td></tr><tr><td style="padding: 25px 0 0 0;">${newNotSend[i].name}</td></tr><tr><td><p style="color: rgb(237, 46, 27); font-family: Arial, sans-serif; font-size: 24px; margin:2px;" align="center"><span style="color: rgb(0, 0, 0)">${newNotSend[i].price}</span></p></td></tr></table></td></tr></table></td></tr>`

				}
			}
			if(newNotSend.length%2 !== 0){
				html+='</tr></table></td></tr>'
			}
			canSend = true;
		}
		if (canSend) {
			User.find({activo: true}).then((doc) => {
				if (doc) {
					for (var i = 0; i < doc.length; i++) {
						let mailOptions = {
							from: '"Yoytec Notifier" <yn@bballoon.net>',
							to: doc[i].email,
							subject: 'Yoytec Notifier New Activity',
							html: html+`</table></td></tr><tr><td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">&reg; Blue Balloon 2017<br/><a href="http://yn.bballoon.net/removeuser/${doc[i].email}" style="color: #ffffff;"><font color="#ffffff">Unsubscribe</font></a> to this newsletter instantly</td><td align="right"><table border="0" cellpadding="0" cellspacing="0"><tr><td><a href="https://www.facebook.com/lexel.pty"><img src="http://bballoon.net/img/tw.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" /></a></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td><a href="http://www.twitter.com/lexel_"><img src="http://bballoon.net/img/fb.png" alt="Facebook" width="38" height="38" style="display: block;" border="0" /></a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`
						}
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) return console.log(error)
							console.log('Message %s sent: %s', info.messageId, info.response);
						});
					}
					NewItems.find({send: false}, function(err, doc) {
						if (err) throw err
						for (var i = 0; i < doc.length; i++) {
							doc[i].send = true
							doc[i].save(function(error) {
								if (err) throw err
							})
						}
					});
					Discount.find({send: false}, function(err, doc) {
						if (err) throw err
						for (var i = 0; i < doc.length; i++) {
							doc[i].send = true
							doc[i].save(function(error) {
								if (err) throw err
							})
						}
					});
				}
			});
		}
	}).catch((e) => {
		console.log(e)
	});
}

module.exports = {
	sendEmail
}
