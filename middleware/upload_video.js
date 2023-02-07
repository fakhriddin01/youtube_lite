const multer = require('multer')
const path = require('path')

const storages = multer.diskStorage({
    destination: (req, file, cb) => {  
        cb(null, 'model/upload_files/videos')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload2 = multer({ storage: storages });

module.exports = upload2;