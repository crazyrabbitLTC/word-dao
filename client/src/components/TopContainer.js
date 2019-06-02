import React, { useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react'
import { MetaMaskButton } from 'rimble-ui';
import './TopContainer.css';

const TopContainer = () => {

    const context = useWeb3Context();
    console.dir(context);

    useEffect(() => {
        
    },[]);


return (<div className="TopMenu"><div className="TopMenu-LeftSide">WordDao
    </div><div className="TopMenu-RightSide">{context.account} <MetaMaskButton size="small">Connect with MetaMask</MetaMaskButton></div></div>)
}

export default TopContainer

