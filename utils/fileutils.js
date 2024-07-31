const fs = require('fs');

function readFile (){
    return JSON.parse(fs.readFileSync('./University.json', 'utf8'))
}

function writeFile(data) {
    fs.writeFileSync('./University.json', JSON.stringify(data, null, 2), 'utf8');
}
module.exports = {readFile, writeFile};