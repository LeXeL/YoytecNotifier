const config = {};
const nodemailer = require('nodemailer');

var env = process.env.NODE_ENV || 'development';

config.transporter = nodemailer.createTransport({
    host:"a2plcpnl0136.prod.iad2.secureserver.net",
    port:465,
    secure:true,
    auth: {
        user: 'yn@bballoon.net',
        pass: 'Atletico123!'
    }
});

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/yoytecdb';
}

module.exports = config;
