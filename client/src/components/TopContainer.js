import React from 'react';
import { MetaMaskButton } from 'rimble-ui';
import './TopContainer.css';

const TopContainer = () => {
return (<div className="TopMenu"><div className="TopMenu-LeftSide">WordDao
    </div><div className="TopMenu-RightSide"><MetaMaskButton size="small">Connect with MetaMask</MetaMaskButton></div></div>)
}

export default TopContainer

