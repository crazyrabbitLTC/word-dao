pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "./WordStorage.sol";



//import "validate Word";
//import "solidity crud";
//import "dao";
//import "withdrawDividents";
//import "external contract access";

contract WordDao is Initializable {

    
// erc721 nft
// validateWord validWord
// soliditycrud crud
// DAO dao
// WithdrawDividends
// externalcontract ExternalContract

    ERC20Mintable public erc20Token;
    ERC721MetadataMintable public erc721Token;
    WordStorage public wordStore;

    event ERC20TokenAttached(address ERC20Token);
    event ERC721TokenAttached(address ERC721Token);
    event WordStoreAttached(address WordStore);

    function initialize (ERC20Mintable _erc20Token, ERC721MetadataMintable _erc721Token, WordStorage _wordStore) public initializer {
        erc20Token = _erc20Token;
        erc721Token = _erc721Token;
        wordStore = _wordStore;
        

        emit ERC20TokenAttached(address(erc20Token));
        emit ERC721TokenAttached(address(erc721Token));
        emit WordStoreAttached(address(wordStore));
    }


}