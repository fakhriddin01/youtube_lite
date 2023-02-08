const express = require('express');
const multer = require('multer');
const path = require('path')
const Controller = require('../controller/controller');
const tokenCheck = require('../middleware/token')
const fs = require('fs')

const router = express.Router();

const upload3 = multer();

const upload = multer();

router 
    .post('/login', Controller.LOGIN)
    .post('/register', upload.single('file'), Controller.REGISTER)
    .post('/', Controller.HOME_PAGE)
    .post('/admin_panel', tokenCheck, Controller.ADMIN_PANEL)
    .post('/upload_video', upload3.single('video'), Controller.UPLOAD)
    .delete('/delete_video/:id', Controller.DELETE)
    .post('/update_video/:id', Controller.UPDATE)

module.exports = router;
