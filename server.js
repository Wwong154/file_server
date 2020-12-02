const net = require('net');
const fs = require('fs');
let path = require('path');

let fileTree = function(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach((file) => {
      file = dir + '/' + file;
      let stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
          results = results.concat(fileTree(file)); // if folder, re for sub file too
      } else { 
          results.push(file); //
      }
  });
  return results;
};

const list = fileTree('.');

const server = net.createServer();
server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8'); // interpret data as text
  client.on('data', (data) => {
    console.log('Requested file from client: ', data)
    for (const file in list) {
      if (list[file].includes(data)) {
        fs.readFile(list[file], 'utf8',(err, content) => {
          console.log(`file ${data} sent to client`)
          client.write(content);
        })
        break;
      } else if (file == list.length - 1) {
        console.log("No such file")
        client.write("no such file"); 
      }
    }
  });
  client.on('error', err => console.log(err.message));
  client.on('close', () => console.log('Client disconnected'));
});


server.listen(3000, () => {
  console.log('Server listening on port 3000!');
}); 