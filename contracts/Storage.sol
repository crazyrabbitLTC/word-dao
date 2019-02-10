pragma solidity ^0.5.0;

contract WordStorage {
    
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
        
    constructor (string memory _language) public {
        language = _language;
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

}