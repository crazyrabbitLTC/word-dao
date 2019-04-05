pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/StandaloneERC20.sol";
import "./DaoStorage.sol";

contract Manager is Initializable {

    event daoStorageCreated(string, address, address);
    
    StandaloneERC20 public token;
    DaoStorage public daoStorage;
    string public daoLanguage;


    function createStorage(string memory _language, string memory _name, string memory _symbol, 
    uint8 _decimals, uint256 _initialSupply, address _initialHolder, address[] memory _minters, 
    address[] memory _pausers) 
    public returns(address, address){
        
    token = new StandaloneERC20();
    token.initialize(_name, _symbol,_decimals, _initialSupply, address(this),_minters,_pausers);

    daoStorage = new DaoStorage();
    daoStorage.initialize(_language);
    daoLanguage = _language;

    emit daoStorageCreated(daoLanguage, address(token),address(daoStorage));

    return (address(token), address(daoStorage));
    }

    function tokenCount() public view returns(uint){
        return token.totalSupply();
    }

    function addWord(string memory _word) public {
        require(daoStorage.setWord(_word));
        token.mint(msg.sender, 1);
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function () payable external {
    }
}