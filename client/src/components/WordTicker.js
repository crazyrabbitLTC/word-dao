import React, { useState, useEffect } from "react";
import "./WordTicker.css";
import {mockTickerData} from "./mocks";


const list = items => {
  return items.map(item => (
    <ul>
      {item.user} has claimed {item.word}{" "}
    </ul>
  ));
};

const WordTicker = () => {
  const [ticker, setTicker] = useState(mockTickerData   );

  return <div className="WordTicker">{list(ticker)}</div>;
};

export default WordTicker;
