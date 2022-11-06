const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const dirRead = path.join(__dirname, 'files');
const dirWrite = path.join(__dirname, 'files-copy');
let dirEntries = [];
fsPromises.mkdir(dirWrite, {recursive: true}).then(function() {   
    fs.readdir(dirWrite, {withFileTypes: true}, function(err, writes) {       
        if (err) throw err;
        for(let file of writes){                    
            let deleteFile = path.join(dirWrite, file.name);
            fs.unlink(deleteFile,function(err, deleted){
                if (err) throw err;
            } );                
        }                
    } );
}).then(function () {
       fs.readdir(dirRead, {withFileTypes: true}, function(err, stats) {    
            if (err) throw err;
            for(let file of stats){
                if(file.isFile()){
                    dirEntries.push(file);        
                    let readFile = path.join(dirRead, file.name); 
                    let writeFile = path.join(dirWrite, file.name);
                    let stream = fs.createReadStream(readFile, 'utf-8');
                    let data = '';
                    stream.on('data', chunk => data += chunk); 
                    let writeStream = fs.createWriteStream(writeFile, 'utf-8');
                    stream.on('end', () => writeStream.write(data));
                    stream.on('error', error => console.log('Error', error.message)); 
                    writeStream.on('error', error => console.log('Error', error.message));                         
                }        
            }
            console.log('copy completed successfully');  
     
        } ); 

}).catch(function() {
    console.log('failed to create directory');
});
