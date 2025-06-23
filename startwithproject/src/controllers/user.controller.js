const apierror = require('../utlis/apierror.js');
const user = require("../models/user.model.js");
const uploadoncloudnairy = require("../utlis/cloudnairy.js");
const registeruser = async(req, res)=>{
    try{ 
        // get user detsils from frontend 
        //check if values are null 
        //check username in database if it exist or not if exist return user is already register 
        //if false insert in username in database 
        //encrypt the password 
        // and in response send username,email all other details expect password and refresh token
        const { fullname , email , username , password } = req.body;
        if(fullname === "")
        { 
           throw new apierror(400 ,"fullname is required");  
        }
        else if(email === "") {
            throw new apierror(400, "email is required");
        }
        else if(username === "")
        {
            throw new apierror(400,"username is required");
        }
        else if(password === "") {
            throw new apierror(400,"passwrod is required");
        }

        const existeduser = user.findOne(username)
        if(existeduser)
        {
            throw new apierror(409,"user existed already");
        }
          
        const avatarlocalpath = req.files?.avatar[0]?.path;
        const coverimagelocalpath = req.files?.coverimage[0]?.path;
        if(!avatarlocalpath)
        {
           const avatarcloud  = await uploadoncloudnairy.uploadOnCloudinary(avatarlocalpath);
        }
        if(!coverimagelocalpath)
        {
            const coverimagecloud = await uploadoncloudnairy.uploadOnCloudinary(coverimagelocalpath);
        }
        if(!avatarcloud)
        {
            throw new apierror(400, "problem from uploading avatr image in on cloud ");
        }

        const person =  await user.create({
            fullname ,
            avatar : avatarcloud.url,
            coverimage : coverimagecloud|| "",
            email ,
            username ,
            password
        })

        if(person === null)
        {
            throw new apierror(404 , "database problem ")
        }
        const createduser = {
           username :  person.username ,
           fullname : person.fullname ,
           email : person.email,
           avatar : person.avatar,
           coverimage : person.coverimage,
           id : person._id
        } // other synatx 
        //const createduser = user.findById(person._id),select("-password -refreshtoken")
        if(!createduser)
        {
            throw new apierror (404 , "something went wrong at server side ");
        }
        return res.status(200).json({createduser});


    }
    catch(err)
    {
        console.log(err);
    }
}
module.exports =  registeruser;