const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const path = require("path");
const file = path.join("words.txt");
const words = new Map();

let lineNumber = 0;

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream(file),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      // Process the line.
      words.set(lineNumber, line);
      lineNumber++;
      
    });

    rl.once('close', (stream) => {
        console.log('File processed.');
        console.log(`Map size: ${words.size}`);
      });
    //await once(rl, 'close');


  } catch (err) {
    console.error(err);
  }
})();


