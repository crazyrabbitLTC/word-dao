const { TestHelper } = require("zos");
const { Contracts, ZWeb3 } = require("zos-lib");
ZWeb3.initialize(web3.currentProvider);
require("chai").should();

const StorageBuilder = Contracts.getFromLocal("StorageBuilder");
const StorageContract = Contracts.getFromLocal("Storage");

contract("builder", function (accounts) {

  let builderInstance;

  beforeEach(async function() {
    this.project = await TestHelper();
    builderInstance = await this.project.createProxy(StorageBuilder);
  });

  it("Should have no languages at first deploy", async function () {
    //const builderInstance = await this.project.createProxy(StorageBuilder);
    const languageCount = await builderInstance.methods.getStorageCount().call();

    assert.equal(languageCount, 0, "No languages set yet");
  });

  it("Should add a language when a storage is deployed", async function () {
    
    const deployStorage = await builderInstance.methods.deployStorage("English").send({from: accounts[0], gas: 5000000});
    const languageCount = await builderInstance.methods.getStorageCount().call();
    //console.log("Languages: ", languageCount);
    assert.equal(languageCount, 1, "One Language set");
  });

  it("Should deploy multiple languages", async function () {
    await builderInstance.methods.deployStorage("English").send({from: accounts[0], gas: 5000000});
    await builderInstance.methods.deployStorage("Spanish").send({from: accounts[0], gas: 5000000});
    await builderInstance.methods.deployStorage("Russian").send({from: accounts[0], gas: 5000000});
    const languageCount = await builderInstance.methods.getStorageCount().call();
    assert.equal(languageCount, 3, "Three languages set");
  });

  it("Should return the language of the storage deployed", async function () {
    await builderInstance.methods.deployStorage("English").send({from: accounts[0], gas: 5000000});
    await builderInstance.methods.deployStorage("Spanish").send({from: accounts[0], gas: 5000000});
    const languageCount = await builderInstance.methods.languages(1).call();
    assert.equal(languageCount, "Spanish", "Correct language returned");
  });

  xit("Should save the address of the deployed storage", async function () {
    const builderInstance = await StorageBuilder.deployed();
    const deployedStorageAddress = await builderInstance.deployStorage(
      "German"
    );
    const numberOfLanguage = await builderInstance.getStorageCount();
    const eventArgs = deployedStorageAddress.logs[0].args;
    const number = numberOfLanguage.toNumber();
    //console.log(typeof(number));
    const addressInArray = await builderInstance.storageLocations(number - 1);
    assert.equal(
      eventArgs._address,
      addressInArray,
      "The address deployed is the same"
    );
    //console.log(deployedStorageAddress.logs[0].args);
  });

  xit("Should Deploy a storage", async function () {
    const builderInstance = await StorageBuilder.deployed();
    const deployedStorageAddress = await builderInstance.deployStorage(
      "German"
    );
    const numberOfLanguage = await builderInstance.getStorageCount();
    const eventArgs = deployedStorageAddress.logs[0].args;
    const number = numberOfLanguage.toNumber();
    const storageContract = await StorageContract.at(eventArgs._address);
    const storageName = await storageContract.language();
    assert.equal(storageName, "German", "Storage language is not correct.");
  });

  xit("Deployed storage should save a word", async function () {
    const builderInstance = await StorageBuilder.deployed();
    const deployedStorageAddress = await builderInstance.deployStorage(
      "German"
    );
    const numberOfLanguage = await builderInstance.getStorageCount();
    const eventArgs = deployedStorageAddress.logs[0].args;
    const number = numberOfLanguage.toNumber();
    const storageContract = await StorageContract.at(eventArgs._address);

    await storageContract.setWord("love");
    //const storageName = await storageContract.language();
    const savedWord = await storageContract.getWordUint256ToString(0);
    assert.equal(savedWord, "love", "Stored word is not correct.");
  });
});
