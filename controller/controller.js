const fs = require('fs');


const Controller = {
    LOGIN: (req, res) => {
        console.log('body',req.body);
    },
    REGISTER: (req, res) => {

        console.log(req.body.username);
      
    }
}

module.exports = Controller;