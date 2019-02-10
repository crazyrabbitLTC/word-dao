pragma solidity ^0.5.0;

import "../contracts/Storage.sol";

contract storageBuilder {
    
    address[] public storageLocations;
    string[] public languages;
    
    function getStorageCount() public view returns(uint256){
        return storageLocations.length;
    }
    
    function deployStorage(string calldata _language) external returns(address){
        WordStorage c = new WordStorage(_language);
        languages.push(_language);
        storageLocations.push(address(c));
        return address(c);
    }
}