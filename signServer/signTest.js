const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
const message = EthCrypto.hash.keccak256([
{ type: "string", value: "banana" }
]);
const signature = EthCrypto.sign(signerIdentity.privateKey, message);
console.log(`Message: ${message}`);
console.log(`Signature: ${signature}`);
console.log(`Signer Public key: ${signerIdentity.address}`);
