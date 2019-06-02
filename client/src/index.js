import React from "react";
import ReactDOM from "react-dom";
import Web3Provider from "web3-react";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { connectors } from "./utils";
import "./index.css";

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName={"ethers.js" | null}>
    <App />
  </Web3Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();