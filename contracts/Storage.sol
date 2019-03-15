pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
//import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-eth/contracts/token/ERC20/StandaloneERC20.sol";


contract Storage is Initializable {

    StandaloneERC20 public erc20;

    address[] public signAuthority;
    mapping(address => bool) public hasAuthorityToSign;
    
    //modifyer to check if Uint is valid
    //modifyer to check if Bytes32 is valid
    //modifyer to check if String is valid
    
    //Note: To make this contract general, maybe you can have an intializer which sets which are relevant.
    
    //Store words based on Integers
    mapping(uint256 => string) internal wordByNumber;
    mapping(string => uint256) internal numberForWord;
    mapping(bytes32 => string) internal wordByBytes32;
    mapping(string => bytes32) internal bytes32ForWord;
    mapping(uint256 => bytes32) internal uint256ForBytes32;
    mapping(bytes32 => uint256) internal bytes32ForWordUint256;
    
    //Arrays
    bytes32[] internal arrayOfBytes32;
    uint256[] internal arrayOfUint256;
    string[] internal arrayOfWords;
    
    //Statistics
    mapping(uint256 => uint256) public wordFrequency;
    uint256 public totalWords;
    string public language;
    
    //events for accessing words
    //wordAdded
    event wordAdded(
        string _word,
        address indexed _from,
        uint256 _wordNumber,
        bytes32 indexed _wordBytes32
        );

    //wordRequested
    event wordRequested(
        uint256 _wordNumber,
        address indexed _from);

    //Storage Created
    event storageCreated(
        string _language,
        address _contractAddress,
        address _erc20TokenAddress
    );
       
        address[] public minters; 
        address[] public pausers;

    function initialize(string memory _language, string memory _symbol, address[] memory _minters, address[] memory _pausers, address[] memory _signAuthority) initializer public returns(address){
            
        //Add Sign Authorities to Array
        // for(uint i=0; i<= _signAuthority.length; i++){
        //     signAuthority.push(_signAuthority[i]);
        //     hasAuthorityToSign[_signAuthority[i]] = true;
        // }

        minters.push(address(this));
        pausers.push(address(this));

        // for(uint i=0; i<= _minters.length; i++){
        //     minters.push(_minters[i]);
        // }

        // for(uint i=0; i<= _pausers.length; i++){
        //     pausers.push(_pausers[i]);

        // }

        erc20 = new StandaloneERC20();
        erc20.initialize(_language, _symbol, 18, 0, msg.sender, minters, pausers);

        language = _language;

        emit storageCreated(_language, address(this), address(erc20));

        return(address(erc20));
    }
    
    //WordSetter
    
    function setWord(string calldata _word) external returns(uint256, bytes32){
        //check word first
        
        bytes32 _wordBytes32 = keccak256(abi.encodePacked(_word));
        
        wordByNumber[totalWords] = _word;
        numberForWord[_word] = totalWords;
        wordByBytes32[_wordBytes32] = _word;
        bytes32ForWord[_word] = _wordBytes32;
        uint256ForBytes32[totalWords] = _wordBytes32;
        bytes32ForWordUint256[_wordBytes32] = totalWords;
        
        arrayOfBytes32.push(_wordBytes32);
        arrayOfWords.push(_word);
        arrayOfUint256.push(totalWords);
        
        
        emit wordAdded(_word, msg.sender,totalWords,_wordBytes32);
        totalWords = totalWords + 1;
    }
    
    //Public Getters
    
    //getWordStringToUint256
    function getWordStringToUint256(string calldata _word) view external returns(uint256){
        return numberForWord[_word];
    }
    //getWordStringToBytes32
    function getWordStringToBytes32(string calldata _word) view external returns(bytes32){
        return bytes32ForWord[_word];
    }
    //getWordUint256ToString
    function getWordUint256ToString(uint256 _wordNumber) view external returns(string memory){
        return wordByNumber[_wordNumber];
    }
    //getWordUint256ToBytes32
    function getWordUint256ToBytes32(uint256 _wordNumber) view external returns(bytes32){
        return uint256ForBytes32[_wordNumber];
    }
    //getWordBytes32ToString
    function getWordBytes32ToString(bytes32 _wordBytes) view external returns(string memory){
        return wordByBytes32[_wordBytes];
    }
    //getWordBytes32ToUint256
    function getWordBytes32ToUint256(bytes32 _wordBytes) view external returns(uint256){
        return bytes32ForWordUint256[_wordBytes];
    }

    //Utils

    function isContract(address _addr) private view returns (bool status){
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
}

}