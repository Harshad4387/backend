const jwt = require('jsonwebtoken');
const ApiError = require("../utlis/apierror");
const { findById } = require('../models/user.model');

const verifyjwt = async(req,res,next)=>{
    try{
        const token = req.cookie?.accesstoken || req.header("Authorization")?.replace("Bearer","");
        if(!token)
        {
            throw new ApiError(404,"token not found to give access");
        }

        const decoded  = jwt.verify(token,process.env.JWT_TOKEN_SECERT);
        const user = findById(decoded?._id);
        if(!user)
        {
            throw new ApiError(404,"token is invalid");

        }
        req.user = user ;
        next();


    }
    catch(err)
    {
        const message = err.message;
        resizeBy.status(400).json(message);
    }
}
module.exports = verifyjwt;