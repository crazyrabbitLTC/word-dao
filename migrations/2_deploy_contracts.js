const StorageBuilder = artifacts.require("StorageBuilder");
const Storage = artifacts.require("Storage");


module.exports = function(deployer) {
  deployer.deploy(StorageBuilder);
  deployer.deploy(Storage, "English");
};
