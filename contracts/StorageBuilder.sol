pragma solidity ^0.5.0;

import "../Storage.sol";

contract storageBuilder {
    
    address[] public storageLocations;
    
    function getStorageCount() public view returns(uint256){
        return storageLocations.length;
    }
    
    function deployStorage(string memory _language) public returns(address){
        WordStorage c = new WordStorage(_language);
        storageLocations.push(address(c));
        return address(c);
    }
}
