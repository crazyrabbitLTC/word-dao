import React, { useState, useEffect } from "react";
import { Button, Input } from "rimble-ui";
import { sampleWordList } from "./utils";
import TxModal from "./TxModal";

function WordForm(props) {
  console.log(`Word Form Props: ${props}`);

  const { showModal, handleWord } = props;
  const [sampleWordIndex, setSampleWordIndex] = useState(0);

  useEffect(() => {
    const pickRandomWord = () => {
      let index = Math.floor(Math.random() * Math.floor(sampleWordList.length));
      setSampleWordIndex(index);
    };

    setInterval(pickRandomWord, 500);
  }, []);

  const [word, setWord] = useState("");

  const handleSubmit = evt => {
    evt.preventDefault();
    showModal(true);
    handleWord(word);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        What will your word be?{"   "}
        <Input
          type="search"
          required="true"
          placeholder={sampleWordList[sampleWordIndex]}
          onChange={e => setWord(e.target.value)}
        />{" "}
        <Button type="submit" width={9}>
          claim
        </Button>
      </form>
    </div>
  );
}

export default WordForm;
