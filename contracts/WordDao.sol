pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";



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

    ERC20Mintable public ERC20Token;
    ERC721MetadataMintable public ERC721Token;

    event ERC20TokenAttached(address ERC20Token);
    event ERC721TokenAttached(address ERC721Token);

    function initialize (ERC20Mintable _ERC20Token, ERC721MetadataMintable _ERC721Token) public initializer {
        ERC20Token = _ERC20Token;
        ERC721Token = _ERC721Token;

        emit ERC20TokenAttached(address(ERC20Token));
        emit ERC721TokenAttached(address(ERC721Token));

    }


}