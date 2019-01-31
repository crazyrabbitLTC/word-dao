pragma solidity >=0.4.24 <0.6.0;

contract WordDao {
    
    mapping (uint256 => string) internal _numberByWords;
    mapping (string => uint256) internal _wordByNumber;
    uint internal _totalWords;

    function initizalize() public {
        _totalWords = 0;
    }

    function setWord(string memory word) public payable{
    require(msg.value == 1 ether);
    
        word = _toLower(word);
        require(_wordByNumber[word] == 0);
        
        _totalWords = _totalWords + 1;
        _numberByWords[_totalWords] = word;
        _wordByNumber[word] = _totalWords;
    }
    
    function getWordNumber(string memory word) public view returns(uint256){
        uint256 returnword= _wordByNumber[word];
        return returnword;
    }
    
    function getNumberWord(uint wordNumber) public view returns (string memory){
        return _numberByWords[wordNumber];
    }
    
    function getTotalWords() public view returns(uint256){
        return _totalWords;
    }
    
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
    
    function _toLower(string memory str) internal returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((bStr[i] >= 65) && (bStr[i] <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(int(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}
