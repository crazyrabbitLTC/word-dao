pragma solidity ^0.5.0;

import "../contracts/Storage.sol";

contract StorageBuilder {
    
    address[] public storageLocations;
    string[] public languages;

    event storageCreated(address indexed _address, string _language);
    
    function getStorageCount() public view returns(uint256){
        return storageLocations.length;
    }
    
    function deployStorage(string calldata _language) external returns(address){
        Storage c = new Storage();
        c.initialize(_language);
        languages.push(_language);
        storageLocations.push(address(c));
        emit storageCreated(address(c), _language);
        return address(c);
    }
}
