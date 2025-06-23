const multer = require('multer');
const path = require('path');

const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', 'public', 'Storage'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // ✅ fixed spelling
    }
});

const upload = multer({ storage: tempStorage });

module.exports = upload;
