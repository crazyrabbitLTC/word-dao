pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
import "./Storage.sol";
import "./StorageBuilder.sol";

contract WordDao is Initializable {

    ERC20 public erc20;
    Storage public dataBank;
    StorageBuilder public dataBankBuilder;

    //this function should create an ERC20 and databankbuilder. I should not need to enter the addresses. 
    function initialize(ERC20 _erc20, Storage _dataBank, StorageBuilder _dataBankBuilder) initializer public {
        erc20 = _erc20;
        dataBank = _dataBank;
        dataBankBuilder = _dataBankBuilder;
    }


}