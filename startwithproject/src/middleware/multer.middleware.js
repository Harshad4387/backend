const multer = require('multer');

const tempstorage = multer.diskStorage({
    destination : function(req,file,cb)
    {
      cb(null,'./public/storage');
    },
    filename : function(req,file,cb)
    {
        cb(null,file.orginalname);
    }
})

const upload = multer({tempstorage});
module.exports = upload;