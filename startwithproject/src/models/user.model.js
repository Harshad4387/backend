const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        lowercase : true ,
        unique : true,
        required : true 
    },
    email : {
        type  : true ,
        lowercase : true ,
        unique : true ,
        required : true 


    },
    fullname : {
        type : String,
        required : true 

    },
    avatar  : { 
        type : String,// cloudnairy String 
        required : true  

    },
     coverimage  : { 
        type : String,// cloudnairy String 
        required : true  

    },
    watchhistory : {
        type : [ {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Video'
        }]

    } ,
    refreshtoken : {
        type : String 
    },
    password : {
        type : String,
        required : true
    }
    


},{timestamps : true}) ;

const user = mongoose.model('user',userSchema);
module.exports = user ;
