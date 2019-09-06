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

module.exports = { setIndexOfWords };
