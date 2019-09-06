const EthCrypto = require("eth-crypto");
const web3Utils = require("web3-utils");

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
    indexSetArray.splice(rand, 1);
    unsortedWordSet.delete(word);
  }
  return { wordSortedToInt, intSortedToWords };
};

const signWord = async (word, index, privateKey) => {

  try {
    const message = EthCrypto.hash.keccak256([
      { type: "string", value: word }, //The Word we are storing
      { type: "uint256", value: web3Utils.toBN(index) }, //The index of the  word
      { type: "string[]", value: word.split("")}, //An array of the charecters
    ]);
    const signature = await EthCrypto.sign(privateKey, message);
    return signature;
  } catch (error) {
    console.log(error);
  }
};

const signWordSet = async (wordSortedToInt, privateKey, address) => {
  //output should be 
  //map: word -> {signature, publicKey}
  let wordSet = new Map();

  const asyncForEach = async () => {
    for (let word of wordSortedToInt) {
      if(typeof(word[1]) !== "number"){
        console.log("Error word: ", word);
      }
      let signature = await signWord(word[0], word[1], privateKey);
      wordSet.set(word, {signature, address});
    }
  };

  const start = async () => {
    await asyncForEach();
    console.log("Done");
  };

  await start();

  return wordSet;
};

module.exports = { setIndexOfWords, signWord, signWordSet };
