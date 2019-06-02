import React, { useEffect } from "react";
import { useWeb3Context } from "web3-react";

import TopContainer from "./components/TopContainer";
import BottomContainer from "./components/BottomContainer";
import MiddleContainer from './components/MiddleContainer';
import "./App.css";

function App() {
  const context = useWeb3Context();

  useEffect(() => {
    context.setFirstValidConnector(["MetaMask", "localHost"]);
  }, []);

  if (!context.active && !context.error) {
    // loading
    console.log("Loading");
    return (
      <div className="App">
        <TopContainer />
        <header className="App-header">Loading....</header>
        <BottomContainer />
      </div>
    );
  } else if (context.error) {
    //error
    console.log("Error");
    return (
      <div className="App">
        <TopContainer />
        <header className="App-header">Error....</header>
        <BottomContainer />
      </div>
    );
  } else {
    // success
    return (
      <div className="App">
        <TopContainer />
        <header className="App-header">
          <MiddleContainer />
        </header>
        <BottomContainer />
      </div>
    );
  }
}

export default App;
