const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
console.log("Signer Identity: ", signerIdentity);
//console.log("PROCESS ARGUMENTS: ", process.argv[2]);
if (process.argv.length < 3) {
  console.log("You forgot your priv key");
}

const privateKey = process.argv[2];
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
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

const setIndexOfWords = async (wordSet, wordToIntegers, integerToWords) => {
  let wordSortedToInt = new Map();
  let intSortedToWords = new Map();
  let unsortedWordSet = new Set();

  //create a new array
  let a = [];

  //fill the array with values from 0->wordSet.length
  for (let i = 0; i < wordSet.size; i++) {
    a.push(i);
  }

  //Now we convert  this array to a set.
  let indexSet = new Set(a);

  //Now we iterate through the Word Set, deleting the integers from our indexSet.
  for (let word of wordSet) {
    if (wordToIntegers[word]) {
      wordSortedToInt.set(word, wordToIntegers[word]);
      intSortedToWords.set(wordToIntegers[word], word);
      indexSet.delete(wordToIntegers[word]);
    } else {
      unsortedWordSet.add(word);
    }
  }

  //Convert IndexSet to Array
  let indexSetArray = Array.from(indexSet);

  //Iterate through unsorted wordSet, giving  them random indexes
  for (let word of unsortedWordSet) {
    //randomly pick a number
    let rand = Math.floor(Math.random() * indexSetArray.length);
    //Find the index at that position in the indexSetArray
    wordSortedToInt.set(word, indexSetArray[rand]);
    intSortedToWords.set(indexSetArray[rand], word);
    //delete it from the  indexSetArray
    indexSetArray.splice(rand,1);
    unsortedWordSet.delete(word);
  }

  console.log("Length of word wordSortedToInt: ", wordSortedToInt.size);
  console.log("Length of integerToWords: ", intSortedToWords.size);
  console.log("length of unsortedWordSet: ", unsortedWordSet.size);
  console.log("Totla Length of the Wordset: ", wordSet.size);
  console.log(
    "Total of the sorted words plus unsorted: ",
    wordSortedToInt.size + unsortedWordSet.size
  );
  console.log(wordSortedToInt);
};
const app = async () => {
  const wordSet = await processFile(file);
  const orderedMap = await setIndexOfWords(
    wordSet,
    wordToIntegers,
    integerToWords
  );

  //const arrayOfSignedWords = await signLibrary(wordSet);
  //await writeToFile(arrayOfSignedWords);
};

app();
console.log("The public Key: ", address);
