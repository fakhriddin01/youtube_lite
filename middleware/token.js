const jwt = require('jsonwebtoken')


module.exports = async function(req, res, next){
    try {
       await jwt.verify(req.body.token, process.env.SECRET_KEY)
       
    } catch (error) {
       
        res.status(400).json({
            msg: "token expired",
            status: "token"
        })
        return
    }
next()
}


