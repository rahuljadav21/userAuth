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
const cokieParser = require('cookie-parser');
var {jwtDecode } = require('jwt-decode'); 
//for ejs templet
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname,'public')));
app.use(cokieParser());

//load config
dotenv.config({path: './config/config.env'})

//connecting to database
connectDB()


//routes
app.get('/',async(req,res)=>{
    var user = null;
    const accessToken = req.cookies["access-token"];
    if(accessToken){
        const decoded = jwtDecode (accessToken);
        user = await User.findById(decoded.userId);
    }else{
        
    }
   
    res.render('home',{user})
})
app.use('/user',userRoutes)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})