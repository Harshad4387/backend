const {Router} = require('express');
const {registeruser,loginuser,logoutuser} = require('../controllers/user.controller.js');
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

module.exports =  router;