const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',async(req,res)=>{

    const user = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    })
    const pw = req.body.password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pw, salt);
    user.password = hash
    await user.save()
    req.session.userId = user._id
    res.redirect('/')
})

router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',async(req,res)=>{
   const user = await User.findOne({username : req.body.username});
   if(!user){
    res.send("Username or Password is Incorrect") 
   }else{
    const isAutherised = bcrypt.compareSync(req.body.password, user.password);
    if(isAutherised){
        req.session.userId = user._id
        res.redirect('/')
      }else{
         res.send("Username or Password is Incorrect") 
      }
   }
  
})
router.get('/secret',async(req,res)=>{
    if(!req.session.userId){
        res.redirect('/user/login')
    }else{
        const user = await User.findById(req.session.userId);
        res.render('secret',{user})
    }
})
router.post('/logout',async(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})
module.exports = router