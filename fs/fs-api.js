const fs = require('fs')

const read_file = (file_name) =>{
    return JSON.parse(fs.readFile(`./model/${file_name}`, 'utf8'))
}


const write_file = (file_name, data) => {
    return fs.writeFile(`./model/${file_name}`, JSON.stringify(data, null, 4), (err) => {
        if(err) throw err;
    })

} 


module.exports = {
    read_file,
    write_file
}