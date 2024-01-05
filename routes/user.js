const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const {sign,verify} = require('jsonwebtoken');
var {jwtDecode } = require('jwt-decode'); 

const createTokens = (user) => {
    const accessToken = sign(
      {userId:user._id,username: user.username, email: user.email },
      "jwtsecretplschange"
    );
  
    return accessToken;
  };
  
  const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
  
    if (!accessToken){
        //return res.status(400).json({ error: "User not Authenticated!" });
        res.redirect('/user/login');
    }
      
  
    try {
      const validToken = verify(accessToken, "jwtsecretplschange");
      if (validToken) {
        req.authenticated = true;
        return next();
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  };


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
    const accessToken = createTokens(user);
    res.cookie("access-token", accessToken, {
            maxAge:60 * 24 * 7 *60 * 1000,
            httpOnly: true,
        });
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
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
            maxAge: 60 * 24 * 7 *60 * 1000,
            httpOnly: true,
        });
        res.redirect('/')
      }else{
         res.status(403).send("Username or Password is Incorrect") 
      }
   }
  
})
router.get('/secret',validateToken,async(req,res)=>{
    const accessToken = req.cookies["access-token"];
    const decoded = jwtDecode (accessToken);
    
    if(!decoded.userId){
        res.redirect('/user/login')
    }else{
        const user = await User.findById(decoded.userId);
        res.render('secret',{user})
    }
})
router.post('/logout',async(req,res)=>{
    res.clearCookie('access-token')
    res.redirect('/')
})
module.exports = router