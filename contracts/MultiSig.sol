pragma solidity ^0.4.24;

import "zos-lib/contracts/Initializable.sol";

contract MultisigExecute {
    uint256 public nonce;     // (only) mutable state
    address[] public owners;  // immutable state

    function initialize(address[] owners_) public initializer{
        owners = owners_;
    }

    function execute(
        address destination,
        uint256 value,
        bytes data,
        bytes32[] sigR,
        bytes32[] sigS,
        uint8[] sigV
    )
        external
    {
        bytes32 hash = prefixed(keccak256(abi.encodePacked(
            address(this), destination, value, data, nonce
        )));

        for (uint256 i = 0; i < owners.length; i++) {
            address recovered = ecrecover(hash, sigV[i], sigR[i], sigS[i]);
            require(recovered == owners[i]);
        }

        // If we make it here, all signatures are accounted for.
        nonce += 1;
        require(destination.call.value(value)(data));
    }

    function () payable {}

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32", hash));
    }
}