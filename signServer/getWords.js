const { createReadStream } = require("fs");
const fs = require("fs");
const { createInterface } = require("readline");
const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();

const path = require("path");
const file = path.join("words.txt");

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

const createOrbitDB = async (ipfs, databaseName) => {
  const orbitdb = await OrbitDB.createInstance(ipfs);
  // Create / Open a database
//   const access = {
//     // Give write access to ourselves
//     write: [orbitdb.key.getPublic('hex')],
//   }
  db = await orbitdb.keyvalue(databaseName);
  await db.load();
  return db;
};

const signWord = async (word, index) => {
  try {
    const message = EthCrypto.hash.keccak256({ word, index });
    const signature = await EthCrypto.sign(signerIdentity.privateKey, message);
    return signature;
  } catch (error) {
    console.log(error);
  }
};

const signLibrary = async (wordMap, db) => {
  let hashArray = [];

  const asyncForEach = async (wordMap, callback, db) => {
    console.log("wordMap Size: ", wordMap.size);
    let identity = db.identity.toJSON();
    for (let index = 0; index < wordMap.size; index++) {
      let word = wordMap.get(index);
      let signature = await signWord(word, index);
      let wordObj = {
        word,
        index,
        signature
      };
      let wordHash = await callback(
        index,
        JSON.stringify({ word, signature, index }),
        db
      );

      console.log({ ...wordObj, orbitDBHash: wordHash });
      hashArray.push({ ...wordObj, orbitDBHash: wordHash });
    }
  };

  const start = async (wordMap, callback, db) => {
    await asyncForEach(wordMap, callback, db);
    console.log("Done");
  };
  await start(wordMap, addWordToDB, db);
  console.log("Really finished");
  return hashArray;
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

const writeToFile = async (wordHashFile, dbIdentity) => {
  // stringify JSON Object
  const jsonContent = JSON.stringify({dbIdentity, words: wordHashFile});
  const identity = JSON.stringify(dbIdentity);
  try {
    fs.writeFile(
      `WordDao_SignedWordList.json`,
      jsonContent,
      "utf8",
      function(err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const app = async () => {
  const wordMap = await processFile(file);
  console.log("Map size: ", wordMap.size);
  const ipfs = await getIPFS();
  const db = await createOrbitDB(ipfs, "DennisonsDatabase");

  const dbIdentity = db.identity.toJSON();
  console.log(`Orbit DB Identity: ${dbIdentity}`);
  const arrayOfSignedWords = await signLibrary(wordMap, db);
  console.log(arrayOfSignedWords);
  await writeToFile(arrayOfSignedWords, dbIdentity);
  //Save Word signatures to a file.
};

app();
