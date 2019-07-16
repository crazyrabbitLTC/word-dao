pragma solidity ^0.5.0;

import "./UnorderedKeySet/contracts/HitchensUnorderedKeySet.sol";

contract WordStorage {

    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;
    HitchensUnorderedKeySetLib.Set wordSet;

    struct WordStruct {
        string name;
        bool delux;
        uint price;
    }
    
    mapping(bytes32 => WordStruct) widgets;
    
    event LogNewWidget(address sender, bytes32 key, string name, bool delux, uint price);
    event LogUpdateWidget(address sender, bytes32 key, string name, bool delux, uint price);    
    event LogRemWidget(address sender, bytes32 key);
    
}