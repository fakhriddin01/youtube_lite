const express = require('express');
const multer = require('multer');
const Controller = require('../controller/controller');
const path = require('path')
const tokenCheck = require('../middleware/token')

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {       
        cb(null, 'model/upload_files/avatars')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });

router 
    .post('/login', Controller.LOGIN)
    .post('/register', upload.single('file'), Controller.REGISTER)
    .post('/', tokenCheck, Controller.HOME_PAGE)


module.exports = router;