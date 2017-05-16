const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');

const {mongoose} = require('../db/mongoose');
const {Descuento} = require('../models/Descuentos');
const {Nuevo} = require('../models/Nuevos');
const {User} = require('../models/Users');


router.get('/', (req, res) => {
    User.find({}).then((doc)=>{
      var text = `There are ${doc.length} people using this tool`
      res.render('beta',{
        form:true,
        count:text,
        Noticias:[
          'Estoy trabajando en el diseño de los correos',
          'Cambie todo el diseño a el framework de bootstrap',
        ]
      });
    })

});
router.get('/removeuser/:email',(req,res)=>{
    var email = req.params.email;
    User.findOne({email:email}).then((doc)=>{
      if (doc){
        doc.activo = false;
        doc.save();
        res.status(200).send("User succesfully removed from newsletter");
      }else{
        res.status(400).send("No user on the database with that email");
      }
    }).catch((e)=>{
      console.log(e);
    })
});
router.post('/newuser',(req, res)=>{
    var user = new User({email: req.body.email});
    User.createUser(user).then((doc)=>{
        var now = moment()
        var formatted = now.format('YYYY-MM-DD HH:mm:ss')
        console.log('[' + formatted + '] Succesfully added the new user: '+doc);
        res.render('beta',{exito:true})
    }).catch((e)=>{
        console.log(e);
        res.render('beta',{errors:{error:'User already exists on the database'}})
    })
});
module.exports = router;
