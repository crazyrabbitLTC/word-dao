pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
//import "zos-lib/contracts/application/App.sol";
import "./Storage.sol";
import "./StorageBuilder.sol";

contract WordDao is Initializable {

    //App public zosApp;
    ERC20 public erc20;
    Storage[] public dataBank;
    StorageBuilder public dataBankBuilder;


    //this function should create an ERC20 and databankbuilder. I should not need to enter the addresses. 
    function initialize() initializer public {

        //zosApp = new App();
        erc20 = new ERC20();
        dataBankBuilder = new StorageBuilder();
    }


}