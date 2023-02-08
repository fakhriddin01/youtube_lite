const fs = require('fs');
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
                expiresIn: '30m'
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
        username = username.trim();
        password = password.trim();
        let foundUser = users.find(u => (u.username).toLowerCase() == username.toLowerCase());
        
        let image  = (req.file) ? req.file.filename : null;
        if(foundUser){
            res.status(400).json({
                msg: "username already registrated"
            });
            return 
        }
        let filename
        if(req.file){
            filename = Date.now()+path.extname(req.file.originalname)
            await fs.promises.writeFile(`./model/upload_files/avatars/${filename}`, req.file.buffer);

        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        users.push({userId: uuidv4(), username: username, password: hashedPassword, image: (filename ? filename :  null) });


        fs.writeFileSync('./model/users.json', JSON.stringify(users, null, 4));
        res.status(200).json({msg: "succesfully registrated"})
        return 
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

        let userInfo;
        if(req.body.userInfo){
            userInfo=req.body.userInfo
        }
        let search;
        if(req.body.search_title){
           search=req.body.search_title
        }

        let userId = token.userId;
        let users = JSON.parse(fs.readFileSync('./model/users.json'))
        let foundUser = users.find(u => u.userId == userId);
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))
        let videos_for_search =videos;
        if(userInfo){
           videos = videos.filter(vid => vid.user.username == userInfo);
        }

        if(search){
            videos=videos.filter(vid => vid.title.toLowerCase().includes(search.toLowerCase()))
        }
        res.status(200).json({
            status: "ok",
            users,
            foundUser,
            videos,
            videos_for_search,
         
        })
    },
    ADMIN_PANEL: async (req, res)=>{
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
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))

        videos = videos.filter(v => v.user.userId == userId);

        res.status(200).json({
            status: "ok",
            videos
        })
        

    },
    UPLOAD: async (req, res)=>{

        let token;
        try {
            token = await jwt.verify(req.body.userinfo, process.env.SECRET_KEY)
        } catch (error) {
            res.status(400).json({
                msg: "token expired",
                status: "token"
            })
            return
        }

        let {title} = req.body;
        let filename = Date.now()
        await fs.promises.writeFile(`./model/upload_files/videos/${filename}${path.extname(req.file.originalname)}`, req.file.buffer);
        
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))
        let users = JSON.parse(fs.readFileSync('./model/users.json'))
        let user = users.find(u => u.userId == token.userId);

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            var time = new Date();
            let min = String.toString(time.getHours()).length == 1  ? "0"+String.toString(time.getHours()) : time.getMinutes()
            let hours = String.toString(time.getHours()).length == 1 ? "0"+String.toString(time.getHours()) : time.getHours()
            let currentTime = hours + ":" + min;
            let size = Math.ceil(req.file.size / 1024 / 1024)

        videos.push({videoId: uuidv4(), user: user, videoName: `${filename}${path.extname(req.file.originalname)}`, title: title, uploadTime: `${today} | ${currentTime}`, size: size})

        fs.writeFileSync('./model/videos.json', JSON.stringify(videos, null, 4));
        res.status(200).json({
            status: "ok"
        })
 
    },
    DELETE: (req, res)=>{
        let videoId = req.params.id;
        // 
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))

        videos.forEach((vid, inx) => {
            if(vid.videoId == videoId){
                fs.unlinkSync(`./model/upload_files/videos/${vid.videoName}`)
                videos.splice(inx, 1);
                return;
            }
        })

        fs.writeFileSync('./model/videos.json', JSON.stringify(videos, null, 4));
        res.status(200).json({
            status: "ok"
        })
    },
    UPDATE: async (req, res)=>{
        
        let videoId=req.params.id;
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
        let {title} =req.body;
        let videos = JSON.parse(fs.readFileSync('./model/videos.json'))
        videos.forEach(vid => {
            if(vid.videoId == videoId){
                vid.title = title
            }
        })

        fs.writeFileSync('./model/videos.json', JSON.stringify(videos, null, 4));
        res.status(200).json({
            status: "ok"
        })


        
    }

}

module.exports = Controller;