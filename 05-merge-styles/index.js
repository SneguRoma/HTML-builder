const fs = require('fs');
const path = require('path');

const fileWright = path.join(__dirname, 'project-dist', 'bundle.css');
const dirRead = path.join(__dirname, 'styles');


const writeStream = fs.createWriteStream(fileWright, 'utf-8');

fs.readdir(dirRead, {withFileTypes: true}, function(err, stats) {    
    if (err) throw err;
    for(let file of stats){        
        if(file.isFile() && path.extname(file.name)==='.css'){                   
            let readFile = path.join(dirRead, file.name); 
            let stream = fs.createReadStream(readFile, 'utf-8');
            let data = '';
            stream.on('data', chunk => data += chunk);            
            stream.on('end', () => writeStream.write(data));
            stream.on('error', error => console.log('Error', error.message)); 
            writeStream.on('error', error => console.log('Error', error.message));                         
        }        
    }
    console.log('bundle completed successfully');  

} );  