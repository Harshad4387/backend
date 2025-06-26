const ApiError = require('../utlis/apierror.js');
const User = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utlis/cloudnairy.js");
const jwt = require('jsonwebtoken');

const registeruser = async (req, res) => {
    try {
        const { fullname, email, username, password } = req.body;
        if (!fullname || !email || !username || !password) {
            throw new ApiError(400, "All fields are required");
        }

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        // File path extraction
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

        let avatarCloudUrl = "";
        let coverImageCloudUrl = "";

        if (avatarLocalPath) {
            const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
            if (!uploadedAvatar) {
                throw new ApiError(400, "Avatar upload failed");
            }
            avatarCloudUrl = uploadedAvatar;
        }
      
        if (coverImageLocalPath) {
            const uploadedCover = await uploadOnCloudinary(coverImageLocalPath);
            if (!uploadedCover) {
                throw new ApiError(400, "Cover image upload failed");
            }
            coverImageCloudUrl = uploadedCover;
        }

        // Create user
        const newUser = await User.create({
            fullname,
            avatar: avatarCloudUrl,
            coverimage: coverImageCloudUrl || "",
            email,
            username,
            password
        });

        if (!newUser) {
            throw new ApiError(500, "User creation failed");
        }

        // Send back user info (excluding password/token)
        const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
        return res.status(201).json({ user: createdUser });

    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        const message = err.message || "Internal server error";
        return res.status(status).json({ error: message });
    }
};


//seperate method for generate refresh token and access token 

const generaterefreshtokenandaccesstoken = async (userid)=>
{ 
    try{
        const user = await User.findById(userid);
        const accesstoken = user.accestokengenertor();
        const refreshtoken = user.refreshtokentokengenertor();

        user.refreshtoken = refreshtoken;
        await user.save({validateBeforeSave : false})
        return {accesstoken,refreshtoken};

    }
    catch(err)
    {
        console.log(err.message);
        
    }

}
const loginuser = async (req,res) =>{
      // get  username and password 
      // check for null values 
      // find username in database 
      //if found check for password for same user 
      // genertate acceess token and refresh token
      //send cookie to user 
      try{
      const {username, password} = req.body; 
    
      if(!username || !password)
      {
        throw new ApiError(404, "all fields are required");

      }
      const user = await User.findOne({username});
      if(!user)
      {
        throw new ApiError(401, "username does not exist");
      }
        const matched = await user.ispasswordmatch(password);
        if(!matched)
        {
            throw new ApiError(404, "password does not match ");
        }
        console.log(user);
        
      const {accesstoken ,refreshtoken} =   await generaterefreshtokenandaccesstoken(user._id);
      const options = {
        httpOnly : true,
        secure : true 
      }
       console.log(accesstoken);
      
      
      return res.status(200).cookie("accesstoken",accesstoken,options).cookie("refreshtoken",refreshtoken,options).json({
        accesstoken,
        refreshtoken
     })


      }
      catch(err)
      {    
           const message = err.message;
           console.log("error occured while login user");
           console.log(message);
           
           return res.status(404).json({error : message});
      }

}

const logoutuser = async(req,res)=>{
    try{

        const user = await User.findById(req.user._id);
    
        if(!user)
        {
            throw new ApiError(402,"user not found to logout");
        }
    
        
        user.refreshtoken = "";
        await user.save({validateBeforeSave : false});

        const options = {
            httpOnly : true ,
            secure  : true 
        }
        return res.status(200).clearCookie("accesstoken",options).clearCookie("refreshtoken",options).json("user logout succesfully");
    }
    catch(err)
    {
        const message = err.message;
        return res.status(404).json(`error : ${message}`);
    }
}

const renewaccestoken = async (req,res)=>{
    const incomingrefrestoken = req.cookies?.accesstoken || req.body.accesstoken;
    if(!incomingrefrestoken){
        throw new ApiError(404,"refresh token not found");
    }
    console.log(incomingrefrestoken);

    const decoded = jwt.verify(incomingrefrestoken,process.env.REFRESH_TOKEN_SECERT);
    console.log(decoded);
    

    if(!decoded)
    {
        throw new ApiError(404, "not get refresh token");
    }
    const user = await User.findById(decoded?.id);

    if(incomingrefrestoken !== user?.refreshtoken)
    {
        throw new ApiError(402, "invalid refresh token");
    }
    const {accesstoken,refreshtoken} = await generaterefreshtokenandaccesstoken(user?._id);

    res.status(200).cookie("accesstoken", accesstoken).cookie("refreshtoken",refreshtoken).json("acces token refresh succesfully");
}

const changepassword = async(req,res)=>{
    try {
        const {oldpassword , newpassword , confirmpassword} = req.body;
        if(!oldpassword || !newpassword || !confirmpassword)
        {
            throw new ApiError (404 , "all fileds are mandotory");
        }
        
        
        if(newpassword !== confirmpassword)
        {
            throw new ApiError(404 , "password doesnt match");
        }
        const user = await User.findById(req.user?._id) ;
        if(!user)
        {
            throw new ApiError(402, "something went wrong");
        }
        const ispasswordmatch = await user.ispasswordmatch(oldpassword);
        
    
        if(!ispasswordmatch)
        {
            throw new ApiError(401, "incorrect pasword");
        }
        user.password = newpassword ;
        await user.save({validateBeforeSave : false});
        const updated = await User.findById(user._id);
        return res.status(200).json(updated);
    } catch (error) {
         console.log(error.message);
         return res.json(error.message)
         
    }
  
}

const getcurrentuser = async(req,res)=>{
    try{
        return res.status(200).json(req.user).select("-password");

    }
    catch(error)
    {  
         console.log(error.message);
        return res.json(error.message);

    }
}

const updateprofile = async(req,res)=>{
   try {
     const {fullname , email} = req.body;
     if(!fullname || !email)
     {
        throw new ApiError(404 , "all flieds are required");
     } 
     const user = await User.findById(req.user?._id);
     user.fullname = fullname;
     user.email = email ;
     await user.save({validateBeforeSave : false});
     const updateduser = await User.findById(user._id);
     return res.status(200).json(updateduser);
   } catch (error) {
        console.log(error.message);
        return res.json(error.message);
        
   }
}

const updateuseravtar = async(req,res)=> {
   try {
     const avatarLocalPath = req.file?.path;
     if(!avatarLocalPath){
         throw new ApiError(404, "file not recived");
     }
    const avatar =   await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
     throw new ApiError(501 , "uploading on cloud fail");
    }
   
    const updated  = await User.findByIdAndUpdate(req.user?._id ,
     {
         $set : {
             avatar : avatar
         }
     },
     {new : true }).select("-password");
     return res.status(200).json(updated);
   } catch (error) {
       console.log(error.message);
       return res.status(404).json(error.message);  
   }

}

const updateusercoverimage = async (req,res)=>{
    try {
        const coverImageLocalPath = req.file?.path;
        if(!coverImageLocalPath)
        {
            throw new ApiError(404 ,"cover image not recived to server");
        }
        const coverimage = await uploadOnCloudinary(coverImageLocalPath);
        if(!coverimage.url)
        {
            throw new ApiError(501 ,"cover image upload failed on server");
        }
    
        const updated = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set : {
                    coverimage : coverimage.url
                }
            },
            {new : true }
        ).select("-password");
    
        return res.status(200).json(updated);
    } catch (error) {
         console.log(error.message);
         return res.json(error.message);
    }
}


module.exports = {
     registeruser,
     loginuser,
     logoutuser,
     renewaccestoken,
     changepassword,
     getcurrentuser,
     updateprofile,
     updateuseravtar,
     updateusercoverimage
    };
