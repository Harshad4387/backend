const {Router} = require('express');
const { registeruser,
     loginuser,
     logoutuser,
     renewaccestoken,
     changepassword,
     getcurrentuser,
     updateprofile,
     updateuseravtar,
     updateusercoverimage} = require('../controllers/user.controller.js');
const upload = require('../middleware/multer.middleware.js')
const verifyjwt = require('../middleware/auth.middleware.js');


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxcount : 1
        },
        { 
            name : "coverimage",
            maxcount : 1
        }

    ]),
    registeruser);

 router.route("/login").post(loginuser);
 router.route("/logout").post(verifyjwt,logoutuser);   
 router.route("/refresh-token").post(renewaccestoken);
 router.route("/changepassword").post(verifyjwt ,changepassword);
 router.route("/getuser").get(verifyjwt ,getcurrentuser);
 router.route("/update").post(verifyjwt ,updateprofile);
 router.route("/updatedavatar").post(verifyjwt,upload.single("avatar") ,updateuseravtar);



module.exports =  router;