const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const { setIndexOfWords, signWordSet } = require("./utils/utils.js");
const EthCrypto = require("eth-crypto");
const identity = EthCrypto.createIdentity();
const publicKey = EthCrypto.publicKeyByPrivateKey(identity.privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

const path = require("path");
const file = path.join("words_alpha.txt");

let wordToInt = fs.readFileSync(path.join("./textFiles/WordToIntegers.json"));
let wordToIntegers = JSON.parse(wordToInt);
console.log("Constructor? ", wordToIntegers["constructor"]);

let intToWord = fs.readFileSync(path.join("./textFiles/IntegersToWords.json"));
let integerToWords = JSON.parse(intToWord);

//Return a Set of Words to LowerCase
const processFile = async file => {
  const processLineByLine = new Promise(function(resolve, reject) {
    const words = new Set();
    try {
      const rl = createInterface({
        input: createReadStream(file),
        crlfDelay: Infinity
      });

      rl.on("line", async line => {
        words.add(line.toLowerCase());
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



const writeToFile = async wordHashFile => {
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
  const wordSet = await processFile(file);
  const { wordSortedToInt, intSortedToWords } = await setIndexOfWords(
    wordSet,
    wordToIntegers,
    integerToWords
  );
console.log("Value of the wordconstructor: ", wordSortedToInt["constructor"]);
  //const signedMap = signWordSet(wordSortedToInt, identity.privateKey, address);

 // console.log("SignedSet Size: ", signedMap.size);
};

app();
console.log("The public Key: ", address);
