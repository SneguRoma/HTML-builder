const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const templateRead = path.join(__dirname, 'template.html');
const templateStream = fs.createReadStream(templateRead, 'utf-8');
const dirWrite = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const articlesRead = path.join(components, 'articles.html');
const headerRead = path.join(components, 'header.html');
const footerRead = path.join(components, 'footer.html');
const articleStream = fs.createReadStream(articlesRead, 'utf-8');
const headerStream = fs.createReadStream(headerRead, 'utf-8');
const footerStream = fs.createReadStream(footerRead, 'utf-8');

const indexWright = path.join(dirWrite, 'index.html');




let data = '';
let indexResult = '';
let article = '';
let header = '';
let footer = '';

fsPromises.mkdir(dirWrite, {recursive: true}).then(function() {   
  templateStream.on('data', chunk => data += chunk);  
  templateStream.on('error', error => console.log('Error', error.message));
  templateStream.on('end', function(){
    fs.readdir(components, {withFileTypes: true}, function(err, stats) {    
      if (err) throw err;
      for(let file of stats){
          if(file.isFile()){
                      
              let readFile = path.join(components, file.name);               
              let stream = fs.createReadStream(readFile, 'utf-8');
              let component = '';
              let shablon ='{{' + file.name.split('.')[0] + '}}';
              
              stream.on('data', chunk => component += chunk);              
              stream.on('end', function(){
                data = data.split(shablon).join(component);                
                let indexStream = fs.createWriteStream(indexWright, 'utf-8');
                indexStream.on('error', error => console.log('Error', error.message)); 
                indexStream.write(data);
                
              }); 
              stream.on('error', error => console.log('Error', error.message));                                      
          }        
      }
  } );     
  });
  
});


const fileWright = path.join(__dirname, 'project-dist', 'style.css');
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
} );  


const assetsRead = path.join(__dirname, 'assets');
const assetsWrite = path.join(dirWrite, 'assets');
let dirEntries = [];
let fileEntries = [];
fsPromises.mkdir(assetsWrite, {recursive: true}).then(function() {   
    fs.readdir(assetsWrite, {withFileTypes: true}, function(err, writes) {       
        if (err) throw err;
        for(let file of writes){
          if(file.isFile()){
            let deleteFile = path.join(assetsWrite, file.name);
            fs.unlink(deleteFile,function(err, deleted){
                if (err) throw err;
            } ); 
          }
          else{                              
            let assetsInstWrite = path.join(assetsWrite, file.name);
            fs.readdir(assetsInstWrite, {withFileTypes: true}, function(err, writes) {       
              if (err) throw err;
              for(let file of writes){
                if(file.isFile()){
                  let deleteFile = path.join(assetsInstWrite, file.name);
                  fs.unlink(deleteFile,function(err, deleted){
                      if (err) throw err;
                  } ); 
                }
          }                    
                           
        });
      }                
    }
   } );
}).then(function () {
       fs.readdir(assetsRead, {withFileTypes: true}, function(err, stats) {    
            if (err) throw err;
            for(let file of stats){
                if(file.isFile()){
                    //dirEntries.push(file);        
                    let readFile = path.join(assetsRead, file.name); 
                    let writeFile = path.join(assetsWrite, file.name);
                    let stream = fs.createReadStream(readFile, 'utf-8');
                    let data = '';
                    stream.on('data', chunk => data += chunk); 
                    let writeStream = fs.createWriteStream(writeFile, 'utf-8');
                    stream.on('end', () => writeStream.write(data));
                    stream.on('error', error => console.log('Error', error.message)); 
                    writeStream.on('error', error => console.log('Error', error.message));                         
                }
                else{
                  let assetsInst = path.join(assetsRead, file.name);                  
                  let assetsInstWrite = path.join(assetsWrite, file.name);                  
                  fsPromises.mkdir(assetsInstWrite, {recursive: true}).then(function(){
                    fs.readdir(assetsInst, {withFileTypes: true}, function(err, stats) {    
                    if (err) throw err;
                    
                    for(let file of stats){
                        if(file.isFile()){
                                  
                            let readFile = path.join(assetsInst, file.name); 
                            let writeFile = path.join(assetsInstWrite, file.name);
                            let streamAsset = fs.createReadStream(readFile , 'binary' );
                            let dataAsset = '';
                            streamAsset.on('data', chunk => dataAsset += chunk);
                             
                            let writeStreamAsset = fs.createWriteStream(writeFile , 'binary' );
                            streamAsset.on('end', () => writeStreamAsset.write(dataAsset));
                            streamAsset.on('error', error => console.log('Error', error.message)); 
                            writeStreamAsset.on('error', error => console.log('Error', error.message));                         
                        }
                    }
                }); 
              });
                         
              }
            
            }
        } ); 

}).catch(function() {
    console.log('failed to create directory');
});