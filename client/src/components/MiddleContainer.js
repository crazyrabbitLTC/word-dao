import React from "react";
import RegisterWord from "./RegisterWord";
import WordTicker from "./WordTicker";
import './MiddleContainer.css';

const MiddleContainer = () => {
  return (
    <div className="MiddleContainer">
        <WordTicker/>
      <RegisterWord />
    </div>
  );
};

export default MiddleContainer;
