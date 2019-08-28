var fs = require("fs");
const path = require("path");
const file = path.join("./textFiles/MarcelProust.txt");

//This Script taken from: http://chrisjopa.com/2016/04/21/counting-word-frequencies-with-javascript/

// read file from current directory
fs.readFile(file, "utf8", function(err, data) {
  if (err) throw err;

  var wordsArray = splitByWords(data);
  var wordsMap = createWordMap(wordsArray);
  //writeToFile(wordsMap);
  var finalWordsArray = sortByCount(wordsMap);
  const { wordToInt, intToWord } = getFinalMapping(finalWordsArray);

  writeToFile(wordToInt, "WordToIntegers.json");
  writeToFile(intToWord, "IntegersToWords.json");

});

const writeToFile = async (wordHashFile, fileName) => {
  // stringify JSON Object

  const jsonContent = JSON.stringify(wordHashFile);
 
  try {
    fs.writeFile(fileName, jsonContent, "utf8", function(err) {
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

function getFinalMapping(array) {
  let wordToInt = {};
  let intToWord = {};

  array.forEach((item, index) => {
    wordToInt[item.name.replace(/[^a-zA-Z ]/g, "")] = index;
    intToWord[index] = item.name;
  });

return {wordToInt, intToWord};
}

function splitByWords(text) {
  // split string by spaces (including spaces, tabs, and newlines)
  // Remove non letter charecters
  let newArray = [];
  var wordsArray = text.replace(/[^a-zA-Z ]/g, " ");
  wordsArray = wordsArray.split(/\s+/);

  return wordsArray;
}

function createWordMap(wordsArray) {
  // create map for word counts
  var wordsMap = {};
  /*
    wordsMap = {
      'Oh': 2,
      'Feelin': 1,
      ...
    }
  */
  wordsArray.forEach(function(key) {
    if (wordsMap.hasOwnProperty(key.toLowerCase())) {
      wordsMap[key.toLowerCase()]++;
    } else {
      wordsMap[key.toLowerCase()] = 1;
    }
  });

  return wordsMap;
}

function sortByCount(wordsMap) {
  // sort by count in descending order
  var finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map(function(key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });

  finalWordsArray.sort(function(a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;
}
