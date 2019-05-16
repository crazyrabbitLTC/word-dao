const { createReadStream } = require("fs");
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
  db = await orbitdb.keyvalue(databaseName);
  await db.load();
  return db;
};

const signWord = async (word, index) => {
    
    let obj = {
        word, index
    }

    console.log(EthCrypto);   
    const message = EthCrypto.hash.Keccak256(obj);
    const signature = EthCrypto.sign(signerIdentity.privateKey, message)
    
    let result = {obj, signature};
    return result;

};

const moveDataToDB = async (wordMap, db) => {
  let hashArray = [];

  const asyncForEach = async (wordMap, callback, db) => {
    console.log("wordMap Size: ", wordMap.size);
    let identity = db.identity.toJSON();
    for (let index = 0; index < wordMap.size; index++) {
     
      let word = wordMap.get(index);
      let signature = signWord(word, index)
      let wordObj = {
          word, 
          signature,
          index,
      }
      let wordHash = await callback(index, JSON.stringify(wordObj), db);

      let result = {
        identity,
        word,
        wordHash,
        index,
        signature
      };
      console.log(wordOBJ);
      hashArray.push(wordOBJ);
    }
  };

  const start = async (wordMap, callback, db) => {
    await asyncForEach(wordMap, callback, db);
    console.log("Done");
  };
  start(wordMap, addWordToDB, db);
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

const app = async () => {
  const wordMap = await processFile(file);
  console.log("Map size: ", wordMap.size);
  const ipfs = await getIPFS();
  const db = await createOrbitDB(ipfs, "DennisonsDatabase");

  const dbIdentity = db.identity.toJSON();
  //We might want to use this identity in the contract

  moveDataToDB(wordMap, db);
};

app();
