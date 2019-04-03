pragma solidity ^0.5.0;

import "../contracts/Storage.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";

contract StorageBuilder {
    
    Storage[] public storageLocations;
    string[] public languages;

    event storageCreated(address indexed _address, string _language, address _tokenAddress);
    
    function getStorageCount() public view returns(uint256){
        return storageLocations.length;
    }

    function getLanguageAtIndex(uint _index) external view returns(string memory){
        require(_index <= languages.length-1, "Index requested out of range");
        return languages[_index];
    }
    

    //require an address
    // function deployStorage(string memory _language, string memory _symbol, address[] memory _minters, address[] memory _pausers, address[] memory _signAuthority) public returns(Storage){
    //     Storage c = new Storage();
    //     address tokenAddress = c.initialize(_language, _symbol, _minters, _pausers, _signAuthority);
    //     languages.push(_language);
    //     storageLocations.push(c);
    //     emit storageCreated(address(c), _language, address(tokenAddress));
    //     return c;
    // }

        function deployStorage(string memory _language, string memory _symbol) public returns(Storage){
        Storage c = new Storage();
        //address tokenAddress = c.initialize(_language, _symbol, _minters, _pausers, _signAuthority);
        languages.push(_language);
        storageLocations.push(c);
        //emit storageCreated(address(c), _language, address(tokenAddress));
        //return c;
    }
}
