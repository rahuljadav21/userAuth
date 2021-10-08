const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const PORT = process.env.PORT|| 5000
const ejs = require('ejs');
const methodoverride = require('method-override');
const path = require('path')
const userRoutes = require('./routes/user')
const User = require('./models/user');
//for ejs templet
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname,'public')));

//load config
dotenv.config({path: './config/config.env'})

//connecting to database
connectDB()

const session = require('express-session');


//session config
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        //cookie will expire in 7 days
    }
  }))

//routes
app.get('/',async(req,res)=>{
    const user = await User.findById(req.session.userId);
    res.render('home',{user})
})
app.use('/user',userRoutes)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})