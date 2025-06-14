const mongoose = require('mongoose');
const dbconnect = async ()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/video`);
        console.log("database connected succesfully");
       //
    }
    catch(error){
        console.log(`error : ${error }`);
    
    }
  
}

module.exports = dbconnect;