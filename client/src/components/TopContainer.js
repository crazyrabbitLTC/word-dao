import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import { MetaMaskButton, Button } from "rimble-ui";

import "./TopContainer.css";

const TopContainer =  () => {
   const context = useWeb3Context();

  return (
    <div className="TopMenu">
      <div className="TopMenu-LeftSide">WordDao</div>
      <div className="TopMenu-RightSide">
        {context.account} Balance: ----- Network: {context.networkId}
      </div>
    </div>
  );
};

export default TopContainer;
