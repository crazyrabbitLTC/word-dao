const { createReadStream } = require("fs");
const { createInterface } = require("readline");
const path = require("path");
const file = path.join("words.txt");
const words = new Map();

let lineNumber = 0;

const processLineByLine = new Promise(function(resolve, reject) {
  try {
    const rl = createInterface({
      input: createReadStream(file),
      crlfDelay: Infinity
    });

    rl.on("line", line => {
      words.set(lineNumber, line);
      lineNumber++;
    });

    rl.once("close", stream => {
      resolve(words.size);
    });
  } catch (err) {
    reject(err);
  }
});

const app = async () => {
  const amount = await processLineByLine;
  console.log("Total amount: ", amount);
};

app();
