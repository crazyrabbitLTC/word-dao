const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
console.log("Signer Identity: ", signerIdentity);
//console.log("PROCESS ARGUMENTS: ", process.argv[2]);
if (process.argv.length < 3){ console.log("You forgot your priv key")};

const privateKey = process.argv[2];
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

const path = require("path");
const file = path.join("words_alpha.txt");
const wordFrequency =  path.join("wordFrequency.json");
//const wordFreqObj =  JSON.parse(wordFrequency);
console.log("wordFrequency:  ", typeof(wordFrequency));

const processFile = async file => {
  const processLineByLine = new Promise(function(resolve, reject) {
    const words = new Map();
    let lineNumber = 0;
    try {
      const rl = createInterface({
        input: createReadStream(file),
        crlfDelay: Infinity
      });

      rl.on("line", async line => {
        words.set(lineNumber, line);
        lineNumber++;
      });

      rl.once("close", stream => {
        resolve(words);
      });
    } catch (err) {
      reject(err);
    }
  });

  let output = await processLineByLine;
  return output;
};



const signWord = async (word, index) => {
  try {
    const message = EthCrypto.hash.keccak256([
      {type: "string",value: word}
      ]
      );
    const signature = await EthCrypto.sign(privateKey, message);
    return signature;
  } catch (error) {
    console.log(error);
  }
};

const signLibrary = async (wordMap, db = {}) => {
  let hashArray = [];
  let finishedWordObject = {};
  const asyncForEach = async (wordMap, callback, db = {}) => {
    console.log("wordMap Size: ", wordMap.size);

    for (let index = 0; index < wordMap.size; index++) {
      let word = wordMap.get(index);
      word = word.toLowerCase();
      let signature = await signWord(word, index);
      let wordObj = {
        word,
        index,
        signedKey: address,
        signature
      };
      finishedWordObject[word] = {signedKey: address, signature};

      console.log({ ...wordObj});
      hashArray.push({ ...wordObj});
      
    }
  };

  const start = async (wordMap, callback, db) => {
    await asyncForEach(wordMap, callback, db);
    console.log("Done");
  };
    await start(wordMap, addWordToDB, db);
  console.log("Really finished");
  console.log("Public key: ", address);
  //return hashArray;
  return finishedWordObject;
};

const addWordToDB = async (index, wordObj, db) => {
  const promise = new Promise(function(resolve, reject) {
    try {
      resolve(db.set(index, { wordObj }));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  return promise;
};

const writeToFile = async (wordHashFile) => {
  // stringify JSON Object
  const jsonContent = JSON.stringify(wordHashFile);
  try {
    fs.writeFile(`WordDao_SignedWordList.json`, jsonContent, "utf8", function(
      err
    ) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    });
  } catch (error) {
    console.log(error);
  }
};



const app = async () => {
  //const wordMap = await processFile(file);
  //const arrayOfSignedWords = await signLibrary(wordMap);
  //await writeToFile(arrayOfSignedWords);
};

app();
console.log("The public Key: ", address);
