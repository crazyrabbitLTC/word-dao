import React, { useState, useEffect } from "react";
import "WordTicker.css";

const mockData = [
  { user: "0xCoihj805dDCa2895497fF41c5f2eF5ef93BaeC43", word: "Hope" },
  { user: "0xC2cE5805dDCaiuiu497fF41c5f2eF5ef93BaeC43", word: "Love" },
  { user: "0xiljh9805dDCa2895497fF41c5f2eF5ef93BaeC43", word: "misery" },
  { user: "0xC2cE5805dDCa289549oioioi5f2eF5ef93BaeC43", word: "shine" },
  { user: "0xkkjhcE5805dDCa2895497fF41c5f2eF5ef93BaeC43", word: "cautious" },
  { user: "0xC2cE5805dDCa2895497fF41c5f2eF5ef93BaeC43", word: "abitious" }
];

const list = items => {
  return items.map(item => (
    <ul>
      {item.user} has claimed {item.word}{" "}
    </ul>
  ));
};

const WordTicker = () => {
  const [ticker, setTicker] = useState(mockData);

  return <div>{list(ticker)}</div>;
};

export default WordTicker;
