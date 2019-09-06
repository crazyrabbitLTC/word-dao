const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const { setIndexOfWords } = require("./utils/utils.js");
const EthCrypto = require("eth-crypto");
const identity = EthCrypto.createIdentity();
const publicKey = EthCrypto.publicKeyByPrivateKey(identity.privateKey);
const address = EthCrypto.publicKey.toAddress(publicKey);

const path = require("path");
const file = path.join("words_alpha.txt");

let wordToInt = fs.readFileSync(path.join("./textFiles/WordToIntegers.json"));
let wordToIntegers = JSON.parse(wordToInt);

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

const signWord = async (word, index) => {
  try {
    const message = EthCrypto.hash.keccak256([{ type: "string", value: word }]);
    const signature = await EthCrypto.sign(privateKey, message);
    return signature;
  } catch (error) {
    console.log(error);
  }
};

const signLibrary = async (wordMap, db = {}) => {
  let hashArray = [];
  let finishedWordObject = {};

  const wordsByIntMap = new Map();
  const intByWordsMap = new Map();

  const asyncForEach = async (wordMap, callback, db = {}) => {
    console.log("wordMap Size: ", wordMap.size);
    let wordSet = new Set(wordMap);
    console.log("Created WordSet. Size is: ", wordSet.size);

    for (let word of wordSet) {
      wordsByIntMap.set(word, wordToIntegers[word]);
      intByWordsMap.set(wordToIntegers[word], word);

      // let signature = await signWord(word, index);
      // let wordObj = {
      //   word,
      //   index,
      //   signedKey: address,
      //   signature
      // };
      // finishedWordObject[word] = { signedKey: address, signature };

      // console.log({ ...wordObj });
      // hashArray.push({ ...wordObj });
    }
    console.log("WordSet Size: ", wordSet.size);
    console.log("WordsByIntMap Size: ", wordsByIntMap.size);
    console.log("IntByWordsMap Size: ", intByWordsMap.size);
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

  console.log("Length of word wordSortedToInt: ", wordSortedToInt.size);
  console.log("Length of integerToWords: ", intSortedToWords.size);
  for (let i = 0; i < 20; i++) {
    console.log(integerToWords[i]);
  }

  //const arrayOfSignedWords = await signLibrary(wordSet);
  //await writeToFile(arrayOfSignedWords);
};

app();
console.log("The public Key: ", address);
