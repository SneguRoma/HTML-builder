const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const fileWright = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(fileWright, 'utf-8'); 
output.write('Введите текст\n');

rl.on('line', (input) => {
  newLine(input); 
});

function newLine(input){
  if(input.indexOf("exit") != -1){            
    rl.close(); 
    process.exit(); 
  }
  else{
    stream.write(input);     
  }
}   

process.on('exit', () => output.write('Удачи!'));
stream.on('error', error => console.log('Error', error.message));