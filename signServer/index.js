const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const IPFS = require("ipfs");
const {utils} = require('ethers');
const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
if (process.argv.length < 3){ console.log("You forgot your priv key")};

const privateKey = process.argv[2];
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

const path = require("path");
const file = path.join("words_alpha.txt");

const getIPFS = async () => {
  const ipfsOptions = {
    EXPERIMENTAL: {
      pubsub: true
    }
  };
  const createIPFS = new Promise(function(resolve, reject) {
    try {
      const ipfs = new IPFS(ipfsOptions);
      ipfs.on("error", e => reject(e));
      ipfs.on("ready", async () => {
        console.log("IPFS READY");
        resolve(ipfs);
      });
    } catch (error) {
      reject(error);
    }
  });
  let output = createIPFS;
  return output;
};

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
    const message = EthCrypto.hash.keccak256(JSON.stringify({ word, index }));
    const signature = await EthCrypto.sign(privateKey, message);
    return signature;
  } catch (error) {
    console.log(error);
  }
};

const signLibrary = async (wordMap) => {
  let hashArray = [];

  const asyncForEach = async (wordMap) => {
    console.log("wordMap Size: ", wordMap.size);

    for (let index = 0; index < wordMap.size; index++) {
      let word = wordMap.get(index);
      word = word.toLowerCase();
      let wordArray = word.split("");
      let wordHash = utils.keccak256(word);
      let wordLength = wordArray.length;

      let signature = await signWord(word, wordArray, wordHash, wordLength, index);
      let wordObj = {
        word,
        wordArray,
        wordHash,
        wordLength,
        index,
        signature
      };

      console.log({ ...wordObj});
      hashArray.push({ ...wordObj});
      
    }
  };

  const start = async (wordMap) => {
    await asyncForEach(wordMap);
    console.log("Done");
  };
    await start(wordMap);
  console.log("Really finished");
  return hashArray;
};

const writeToFile = async (wordHashFile, dbIdentity) => {

  const jsonContent = JSON.stringify({ dbIdentity, words: wordHashFile });
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
  const wordMap = await processFile(file);
  console.log("Map size: ", wordMap.size);
  const ipfs = await getIPFS();
  const arrayOfSignedWords = await signLibrary(wordMap);
  console.log(arrayOfSignedWords.length);
  await writeToFile(arrayOfSignedWords);
  const ipfsBlobHash = await ipfs.addFromFs(`WordDao_SignedWordList.json`);
  console.log("The final Hash: ", ipfsBlobHash);

};

app();
