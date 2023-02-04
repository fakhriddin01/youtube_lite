const express = require('express');
const multer = require('multer');
const Controller = require('../controller/controller');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload_files/avatars')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });
const router = express.Router();


router 
    .post('/login', Controller.LOGIN)
    .post('/register', upload.single('file'), Controller.REGISTER)



module.exports = router;