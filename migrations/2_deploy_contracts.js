const StorageBuilder = artifacts.require("StorageBuilder");

module.exports = function(deployer) {
  deployer.deploy(StorageBuilder);
};
