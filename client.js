const net = require('net');
const readline = require('readline');
const fs = require('fs');
const { exit } = require('process');

const conn = net.createConnection({ 
  host: 'localhost', // change to IP address of computer or ngrok host if tunneling
  port: 3000 // or change to the ngrok port if tunneling
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const serverRespone = (input) => {
  return new Promise ((resolve) => {
    conn.on('data', (data) => {
      if (data === "no such file") {
        console.log('File does not exist');
        resolve();
      } else {
        fs.writeFile(`./download/${input}`, data, (err) => {
          if (err) {
            throw err;
          } else { 
            let stats = fs.statSync(`./download/${input}`);
            console.log(`Downloaded and saved ${stats.size} bytes to ./download/${input}`);
            resolve();
          }
        });
      }
    });
  });
}

const askQuestions = () => {
  rl.question('Any file you wish to request from server? \n', async (input) => {
      if (input === '\u0003') exit();
      conn.write(input);
      await serverRespone(input);
      exit();
  });
}

conn.setEncoding('utf8'); // interpret data as text

askQuestions();



