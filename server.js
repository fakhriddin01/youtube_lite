const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser');


const router = require('./router/router');

dotenv.config();
const server = express();
// server.use(fileUpload());

server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}));
server.use(router)



server.listen(process.env.PORT, ()=>{
    console.log(`server running on port: ${process.env.PORT}`);
})