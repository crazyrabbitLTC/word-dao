pragma solidity >=0.4.24 <0.6.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20//ERC20Detailed.sol";
import "openzeppelin-eth/contracts/token/ERC20//ERC20Mintable.sol";
import "openzeppelin-eth/contracts/token/ERC20//ERC20Pausable.sol";
//import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";

contract WordDao is Initializable, ERC20Detailed, ERC20Mintable, ERC20Pausable {
    
    mapping (uint256 => string) internal _numberByWords;
    mapping (string => uint256) internal _wordByNumber;
    mapping (uint256 => uint256) internal _requestFrequency;

    uint internal _totalWords;
    uint internal _totalRequests;

    event wordAdded(address _adder, string word);

     function initialize(
        string memory name, string memory symbol, uint8 decimals, uint256 initialSupply, address initialHolder,
        address[] memory minters, address[] memory pausers
    ) public initializer {
        ERC20Detailed.initialize(name, symbol, decimals);

        // Mint the initial supply
        _mint(initialHolder, initialSupply);

        // Initialize the minter and pauser roles, and renounce them
        ERC20Mintable.initialize(address(this));
        _removeMinter(address(this));

        ERC20Pausable.initialize(address(this));
        _removePauser(address(this));

        // Add the requested minters and pausers (this can be done after renouncing since
        // these are the internal calls)
        for (uint256 i = 0; i < minters.length; ++i) {
            _addMinter(minters[i]);
        }

        for (uint256 i = 0; i < pausers.length; ++i) {
            _addPauser(pausers[i]);
        }
    }

    function initialize(
        string memory name, string memory symbol, uint8 decimals, address[] memory minters, address[] memory pausers
    ) public initializer {
        ERC20Detailed.initialize(name, symbol, decimals);

        // Initialize the minter and pauser roles, and renounce them
        ERC20Mintable.initialize(address(this));
        _removeMinter(address(this));

        ERC20Pausable.initialize(address(this));
        _removePauser(address(this));

        // Add the requested minters and pausers (this can be done after renouncing since
        // these are the internal calls)
        for (uint256 i = 0; i < minters.length; ++i) {
            _addMinter(minters[i]);
        }

        for (uint256 i = 0; i < pausers.length; ++i) {
            _addPauser(pausers[i]);
        }
    }



    function setWord(string memory word) public payable{
    //require(msg.value == 1 ether);
    
        //word = _toLower(word);
        require(_wordByNumber[word] == 0);
        
        _totalWords = _totalWords + 1;
        _numberByWords[_totalWords] = word;
        _wordByNumber[word] = _totalWords;
        emit wordAdded(msg.sender, word);
        _mint(msg.sender, 1);
    }

    function _incrementCounter() internal {
        _totalRequests = _totalRequests + 1;
    }

    function _incrementWordFrequency(uint _word) internal {
        _requestFrequency[_word] = _requestFrequency[_word] + 1;
    }
    
    function getWordNumber(string calldata word) external returns(uint256){
        //require word exists
        uint256 returnword = _wordByNumber[word];
        _incrementWordFrequency(returnword);
        _incrementCounter();
        return returnword;
    }

    function _public_getWordNumber(string memory word) public returns(uint256){
        //require word exists
        uint256 returnword= _wordByNumber[word];
        _incrementWordFrequency(returnword);
        _incrementCounter();
        return returnword;
    }

    function getNumberWord(uint _wordNumber) external returns (string memory){
        //require that word exists
        _incrementWordFrequency(_wordNumber);
        _incrementCounter();
        return _numberByWords[_wordNumber];
    }

    function _public_getNumberWord(uint wordNumber) public returns (string memory){
        //require that word exists
        _incrementWordFrequency(_wordNumber);
        _incrementCounter();
        return _numberByWords[wordNumber];
    }
    
    function getTotalWords() public view returns(uint256){
        return _totalWords;
    }
    
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function getTotalRequests() public view returns(uint256){
        return _totalRequests;
    }
    
    // function _toLower(string memory str) internal returns (string memory) {
    //     bytes memory bStr = bytes(str);
    //     bytes memory bLower = new bytes(bStr.length);
    //     for (uint i = 0; i < bStr.length; i++) {
    //         // Uppercase character...
    //         if ((bStr[i] >= 65) && (bStr[i] <= 90)) {
    //             // So we add 32 to make it lowercase
    //             bLower[i] = bytes1(int(bStr[i]) + 32);
    //         } else {
    //             bLower[i] = bStr[i];
    //         }
    //     }
    //     return string(bLower);
    // }
    
}
