const fs = require('fs');
const {read_file, write_file} = require('../fs/fs-api')
const bcrypt = require('bcryptjs')
const {v4: uuidv4} = require('uuid')
const path = require('path');
const jwt = require('jsonwebtoken');


const Controller = {
    LOGIN: async (req, res) => {
        let users = JSON.parse(fs.readFileSync('./model/users.json'))
        let {username, password} = req.body;
        let foundUser = users.find(u => (u.username).toLowerCase() == username.toLowerCase());
        let check_psw;

        if(foundUser){
            check_psw = await bcrypt.compare(password, foundUser.password);
        }
        if(foundUser && check_psw){
            let token = jwt.sign({ userId: foundUser.userId}, process.env.SECRET_KEY, {
                expiresIn: '10m'
            })

            res.status(200).json({
                status: "loged",
                token: token
            });
            return;
        }
        if(foundUser && !check_psw){
            res.status(401).json({
                msg: "Please check your password",
                status: 'password'
            });
            return;
        }

        res.status(300).json({
            msg: "user not found",
            status: 'user'
        })

    },
    REGISTER: async (req, res) => {
        let users = JSON.parse(fs.readFileSync('./model/users.json'))
        let {username, password} = req.body;
        let foundUser = users.find(u => (u.username).toLowerCase() == username.toLowerCase());
        
        let image  = (req.file) ? req.file.filename : null;
        if(foundUser){
            if(image){
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        throw err;
                    }            
                });
            }
            return res.status(400).json("username already registrated");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        users.push({userId: uuidv4(), username: username, password: hashedPassword, image: image});


        fs.writeFileSync('./model/users.json', JSON.stringify(users, null, 4));
        res.status(200).json("succesfully registrated")
    },
    HOME_PAGE: async (req, res)=>{
        let token;
        try {
            token = await jwt.verify(req.body.token, process.env.SECRET_KEY)
        } catch (error) {
            res.status(400).json({
                msg: "token expired",
                status: "token"
            })
        return
        }        
        let userId = token.userId;
        let users = JSON.parse(fs.readFileSync('./model/users.json'))
        let foundUser = users.find(u => u.userId == userId);
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))

        res.status(200).json({
            status: "ok",
            users,
            foundUser,
            videos
        })
    }
}

module.exports = Controller;