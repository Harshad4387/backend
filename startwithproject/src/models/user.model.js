const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
userSchema.pre("save" , async function(next) {
    if(this.isModified("password")){
    this.password = await bcrpyt.hash(this.password,10);
    next();
    }
    else return next();
})
userSchema.methods.ispasswordmatch = async function(password)
{
    return await bcrpyt.compare(password , this.password)
}
userSchema.methods.accestokengenertor = function()
{
    jwt.sign(
        {   
            __id : this.__id,
            password : this.password,
            username : this.username,
            fullname : this.fullname
        },
        process.env.JWT_TOKEN_SECERT,
        {
            expires : process.env.JWT_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.refreshtokentokengenertor = function()
{
    jwt.sign({
         __id : this.__id
    } ,
process.env.REFRESH_TOEKN_SECERT,
{
    expires : REFRESH_TOEKN_EXPIRY
})
}

const user = mongoose.model('user',userSchema);
module.exports = user ;
