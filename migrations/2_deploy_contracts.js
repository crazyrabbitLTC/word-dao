const StorageBuilder = artifacts.require("StorageBuilder");
const Storage = artifacts.require("Storage");
const ERC20 = artifacts.require("ERC20");


module.exports = function(deployer) {
  //deployer.deploy(StorageBuilder);
  //deployer.deploy(Storage, "English");
  deployer.deploy(ERC20);
};
