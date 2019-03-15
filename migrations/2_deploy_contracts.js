const StorageBuilder = artifacts.require("StorageBuilder");
const Storage = artifacts.require("Storage");
const ERC20 = artifacts.require("ERC20");


const language = "english";
const symbol = "WDENG";
//const minters = ['0x1eeb9c468707f270f82ba0e04cb413f0af42d094','0xf9cb4c64d9eab3590c3ab96dd7f9986dce293d09'];
const minters = [];
const pausers = minters;
const signers = minters;


module.exports =  function(deployer, network, accounts) {

  // deployer.deploy(Storage).then(function(instance){
  //   console.log(instance);
  // })

  deployer.then(function() {
    return Storage.new();
  }).then(function(instance){
    //console.log(instance.send);
    return instance.initialize(language,symbol,minters,pausers,signers, {from: accounts[0], gas: 6000000});
  }).then(function(address) {
    console.log(address);
  })

// var a,b;

//   deployer.then(function() {
//     return StorageBuilder.new();
//   }).then(function(instance){
//     //a = instance;
//     //console.log(a);
//     return instance.deployStorage(language,symbol,minters,pausers,signers);
//   }).then(function(returnValue){
//     console.log(returnValue);
//   })

  //const storeBuilder = await deployer.deploy(StorageBuilder);
  //console.log(storeBuilder);
  //const storeBuilderInstance = await storeBuilder.deployed();
  //console.log(storeBuilderInstance);
  //const storeAddress = await storeBuilder.deployed().deployStorage(language,symbol,minters,pausers,signers);
  //console.log(`Store Address is: ${storeAddress}`);
  //deployer.deploy(Storage, "English");

};


// var a, b;
// deployer.then(function() {
//   // Create a new version of A
//   return A.new();
// }).then(function(instance) {
//   a = instance;
//   // Get the deployed instance of B
//   return B.deployed();
// }).then(function(instance) {
//   b = instance;
//   // Set the new instance of A's address on B via B's setA() function.
//   return b.setA(a.address);
// });

// module.exports = async function(deployer) {
//   deployer.deploy(NppToken).then(() => {
//     return deployer.deploy(CrowdSale, NppToken.address);
//   }).then(async () => {
//     var token = await NppToken.deployed();
//     await token.transferOwnership(CrowdSale.address);       
//   });      
// };