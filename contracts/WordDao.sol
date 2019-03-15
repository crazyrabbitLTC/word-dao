pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
import "zos-lib/contracts/application/App.sol";
import "./Storage.sol";
import "./StorageBuilder.sol";

contract WordDao is Initializable {

    App public zosApp;
    ERC20 public erc20;

    //This could be a struct array with Dao + tokenAddress
    ERC20[] public tokenAddresses;
    string[] public DaoList;
    Storage[] public dataBanks;


    StorageBuilder public dataBankBuilder;


    //event for creating a dao
    event DaoCreated(string language, address ERC20Token, address DataBank);

    //this function should create an ERC20 and databankbuilder. I should not need to enter the addresses. 
    function initialize() initializer public {

        zosApp = new App();


        //This should be upgradable
        dataBankBuilder = new StorageBuilder();
    }

    //in the future this should have an owner.
    function createWordDao(string memory _language) public {
        
        ERC20 _erc20 = new ERC20();
        tokenAddresses.push(_erc20);
        DaoList.push(_language);

        Storage _tempStoreAddress;
        _tempStoreAddress = dataBankBuilder.deployStorage(_language, _erc20);
        dataBanks.push(_tempStoreAddress);

        emit DaoCreated(_language, address(_erc20), address(_tempStoreAddress));
    }


}