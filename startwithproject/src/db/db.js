const mongoose = require('mongoose');
const dbconnect = async ()=>{
    try{
        const connection = await mongoose.connect(`mongodb+srv://inventory_database:Harshu4387@cluster0.nwvvm9a.mongodb.net/video`);
        console.log("database connected succesfully");
        console.log(connection.connection.host);
    }
    catch(error){
        console.log(`error : ${error }`);
        

    }
  
}

module.exports = dbconnect;