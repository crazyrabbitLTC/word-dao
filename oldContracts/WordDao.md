pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
//import "zos-lib/contracts/application/App.sol";
import "./Storage.sol";
import "./StorageBuilder.sol";

contract WordDao is Initializable {



    //This could be a struct array with Dao + tokenAddress

    string[] public DaoList;
    Storage[] public dataBanks;


    StorageBuilder public dataBankBuilder;


    //event for creating a dao
    event DaoCreated(string language, address DataBank);

    //this function should create an ERC20 and databankbuilder. I should not need to enter the addresses. 
    function initialize() initializer public {
        //zosApp = new App();
        //This should be upgradable
        dataBankBuilder = new StorageBuilder();
    }

    //in the future this should have an owner.
    // function createWordDao(string memory _language, string memory _symbol, address[] memory _minters, address[] memory _pausers, address[] memory _signAuthority) public {
        
    //     DaoList.push(_language);

    //     Storage _tempStoreAddress;
    //     _tempStoreAddress = dataBankBuilder.deployStorage(_language, _symbol, _minters, _pausers, _signAuthority);
    //     dataBanks.push(_tempStoreAddress);

    //     emit DaoCreated(_language, address(_tempStoreAddress));
    // }

    // function createInstance(bytes memory _data, string memory _packageName) public returns (address proxy) {
    // string memory contractName = "StorageBuiler";

    // //Not sure who the Admin should be yet. Probably some Dao.
    // address admin = msg.sender;
    // return address(zosApp.create(_packageName, contractName, admin, _data));
    // }


}