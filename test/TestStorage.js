const { TestHelper } = require("zos");
const { Contracts, ZWeb3 } = require("zos-lib");
ZWeb3.initialize(web3.currentProvider);
require("chai").should();

const StorageBuilder = Contracts.getFromLocal("StorageBuilder");
const StorageContract = Contracts.getFromLocal("Storage");

contract("builder", accounts => {
  beforeEach(async function() {
    this.project = await TestHelper();

    console.log(this.project);
  });

  it("Should have no languages at first deploy", async () => {
    const builderInstance = await this.project.createProxy(StorageBuilder);
    const languageCount = await builderInstance.getStorageCount();

    assert.equal(languageCount, 0, "No languages set yet");
  });
  xit("Should add a language when a storage is deployed", async () => {
    const builderInstance = await StorageBuilder.deployed();
    const deployStorage = await builderInstance.deployStorage("English");
    const languageCount = await builderInstance.getStorageCount();
    //console.log("Languages: ", languageCount);
    assert.equal(languageCount, 1, "One Language set");
  });

  xit("Should deploy multiple languages", async () => {
    const builderInstance = await StorageBuilder.deployed();
    await builderInstance.deployStorage("English");
    await builderInstance.deployStorage("Spanish");
    const languageCount = await builderInstance.getStorageCount();
    assert.equal(languageCount, 3, "Three languages set");
  });

  xit("Should return the language of the storage deployed", async () => {
    const builderInstance = await StorageBuilder.deployed();
    await builderInstance.deployStorage("English");
    await builderInstance.deployStorage("Spanish");
    const languageCount = await builderInstance.languages(2);
    assert.equal(languageCount, "Spanish", "Correct language returned");
  });

  xit("Should save the address of the deployed storage", async () => {
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

  xit("Should Deploy a storage", async () => {
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

  xit("Deployed storage should save a word", async () => {
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
