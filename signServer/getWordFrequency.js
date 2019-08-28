var fs = require('fs');
const path = require("path");
const file = path.join("./textFiles/MarcelProust.txt");

//This Script taken from: http://chrisjopa.com/2016/04/21/counting-word-frequencies-with-javascript/

// read file from current directory
fs.readFile(file, 'utf8', function (err, data) {

  if (err) throw err;

  
  var wordsArray = splitByWords(data);
  var wordsMap = createWordMap(wordsArray);
  writeToFile(wordsMap);
  var finalWordsArray = sortByCount(wordsMap);
  console.log('The word "' + finalWordsArray[0].name + '" appears the most in the file ' +
  finalWordsArray[0].total + ' times');
  console.log(finalWordsArray);


  /*
    output:
    [ { name: 'he', total: 10 },
      { name: 'again', total: 7 },
      { name: 'away', total: 7 },
      ... ]
    The word "he" appears the most in the file 10 times
  */

});


function splitByWords (text) {
  // split string by spaces (including spaces, tabs, and newlines)
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}


function createWordMap (wordsArray) {

  // create map for word counts
  var wordsMap = {};
  /*
    wordsMap = {
      'Oh': 2,
      'Feelin': 1,
      ...
    }
  */
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}


function sortByCount (wordsMap) {

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

const writeToFile = async (wordHashFile) => {
  // stringify JSON Object
  const jsonContent = JSON.stringify(wordHashFile);
  try {
    fs.writeFile(`wordFrequency.json`, jsonContent, "utf8", function(
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

