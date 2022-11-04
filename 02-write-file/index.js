const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const fileWright = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(fileWright, 'utf-8'); 


rl.question('Введите текст:\n', (answer) => {
  //console.log(typeof answer)
  function newLine(){
    rl.on('line', (input) => {
        if(input.indexOf("exit") != -1){            
            rl.close(); 
            process.exit(); 
        }
        else{
          stream.write(input);
          newLine();  
        }
    });
     
  }
  if (answer.indexOf("exit") != -1){    
    rl.close();
    process.exit();
  }
   else {
    stream.write(answer); 
    newLine();
  }  
});
process.on('exit', () => output.write('Удачи!'));





/* stdout.write('Введите текст:\n');
stdin.on('data', data => {
    const textString = data.toString();
    const reverseName = textString.split('').reverse().join('');
    stdout.write(`\nТвоё имя наоборот ${reverseName}`);
    process.exit();
  }); */