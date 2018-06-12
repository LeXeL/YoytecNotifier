# yoytecnotifier
Yoytec Notifier it's a web crawler that scans the [Yoytec](https://www.yoytec.com) website and grabs them so they can append it to a email template to be sended...

## Install
First you need to create some ENV variable on your project!
```EMAIL_HOST:        yoytec.com // Email host
EMAIL_PASS:           thisismyfuckingsecurepassword //Email password
EMAIL_USER:           admin@yoytec.com //Email username
MONGODB_URI:          mongodb://url:port //mongodb url 
WAIT_TIME:            10m //Re Scan time 
```
Add this to a local `.env` file

Then run 
```javascript
npm run start
```

*NOTE:* You need to have Mongo db running