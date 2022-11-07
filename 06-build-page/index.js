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



let dirEntries = [];
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
              dirEntries.push(file);        
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






    
 /*      articleStream.on('data', chunk => article += chunk);
      articleStream.on('error', error => console.log('Error', error.message));
      articleStream.on('end', 
      function(){
        headerStream.on('data', chunk => header += chunk);
        headerStream.on('error', error => console.log('Error', error.message));
        headerStream.on('end', function(){
          footerStream.on('data', chunk => footer += chunk);
          footerStream.on('error', error => console.log('Error', error.message));
          footerStream.on('end', function(){
            dirEntries = data.split('{{header}}').join(header).split('{{articles}}').join(article).split('{{footer}}').join(footer);
            indexStream.write(dirEntries);
            //console.log(dirEntries);
          });
        });
        
      }); */
     
  });
  
});