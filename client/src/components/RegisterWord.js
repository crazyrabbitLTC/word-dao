import React, { useState, useEffect } from "react";

import WordForm from "./WordForm";
import TxModal from "./TxModal";

function RegisterWord() {
  console.log("ARe we renderign?");

  const [modalState, setModalState] = useState(false);
  const hideModal = () => setModalState(false);
  const showModal = () => setModalState(true);

  const [word, setWord] = useState("");


  return (
    <div>
      <WordForm showModal={showModal} handleWord={setWord}/>
      <TxModal isOpen={modalState} hideModal={hideModal} word={word} />
    </div>
  );
}

export default RegisterWord;
