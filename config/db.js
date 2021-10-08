const mongoose =require('mongoose');
//Save your MONGO_URI in config.env file in config directory
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(err){
    console.error(err)
    process.exit(1)
    }
}

module.exports = connectDB