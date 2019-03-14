pragma solidity ^0.5.0;

import "../contracts/Storage.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";

contract StorageBuilder {
    
    address[] public storageLocations;
    string[] public languages;

    event storageCreated(address indexed _address, string _language, address _tokenAddress);
    
    function getStorageCount() public view returns(uint256){
        return storageLocations.length;
    }

    function getLanguageAtIndex(uint _index) external view returns(string memory){
        require(_index <= languages.length-1, "Index requested out of range");
        return languages[_index];
    }
    
    function deployStorage(string calldata _language, ERC20 _tokenAddress) external returns(Storage){
        Storage c = new Storage();
        c.initialize(_language, _tokenAddress);
        languages.push(_language);
        storageLocations.push(address(c));
        emit storageCreated(address(c), _language, address(_tokenAddress));
        return c;
    }
}
