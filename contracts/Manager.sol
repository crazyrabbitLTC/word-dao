pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/StandaloneERC20.sol";
import "./DaoStorage";

contract Manager is Initializable {

    event daoStorageCreated(string, address, address);
    
    struct WordDao {
        string _language;
        address _token;
        address _daoStorage;
    }

   WordDao[] wordDaos;
    
    function createStorage(string memory _language, string memory _name, string memory _symbol, 
    uint8 _decimals, uint256 _initialSupply, address _initialHolder, address[] memory _minters, 
    address[] memory _pausers) 
    public{
        
    StandaloneERC20 erc20 = new StandaloneERC20();
    erc20.initialize(_name, _symbol,_decimals, _initialSupply, _initialHolder,_minters,_pausers);

    DaoStorage daoStorage = new DaoStorage();
    daoStorage.initialize(_language);

    WordDao memory wordDao;
    wordDao._language = _language;
    wordDao._token = address(erc20);
    wordDao._daoStorage = address(daoStorage);
    
    emit daoStorageCreated(wordDao._language, wordDao._token,wordDao._daoStorage);
    }

}