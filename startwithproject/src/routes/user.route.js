const {Router} = require('express');
const registeruser = require('../controllers/user.controller.js');
const upload = require('../middleware/multer.middleware.js')

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

module.exports =  router;