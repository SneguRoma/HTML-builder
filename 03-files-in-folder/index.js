const fs = require('fs');
const path = require('path');

const dirRead = path.join(__dirname, 'secret-folder');
let dirEntries = [];

fs.readdir(dirRead, {withFileTypes: true}, function(err, stats) {
    //console.log(stats);
    for(let file of stats){
        if(file.isFile()){
        dirEntries.push(file);
        let stat;
        let pathFile = path.join(__dirname, 'secret-folder', file.name); 
        fs.stat(pathFile, function(err, stats) {
             stat = stats.size;             
             console.log(file.name.split('.').join(' - ') + ' - ' + stats.size + 'b'); 
            } );         
        }         
    }    
     
} );   