const jwt = require('jsonwebtoken');
const ApiError = require("../utlis/apierror");
const User = require('../models/user.model');


const verifyjwt = async(req,res,next)=>{
    try{
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer","").trim();
        if(!token)
        {
            throw new ApiError(404,"token not found to give access");
        }

        const decoded  = jwt.verify(token,process.env.JWT_TOKEN_SECERT);
        
        
    
        req.user = decoded ;
        console.log(decoded);
        
        next();


    }
    catch(err)
    {
        const message = err.message;
        res.status(400).json(message);
    }
}
module.exports = verifyjwt;