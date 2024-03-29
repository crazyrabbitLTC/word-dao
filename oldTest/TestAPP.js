const { TestHelper } = require("zos");
const { Contracts, ZWeb3 } = require("zos-lib");
const truffleAssert = require("truffle-assertions");
ZWeb3.initialize(web3.currentProvider);
require("chai").should();

////console.log(web3.utils);

const StorageBuilder = Contracts.getFromLocal("StorageBuilder");
const StorageContract = Contracts.getFromLocal("Storage");
const WordDaoMaster = Contracts.getFromLocal("WordDao");
const ERC20 = artifacts.require("ERC20");
const StorageInterface = artifacts.require("Storage");

contract("StorageBuilder", function(accounts) {
  //let builderInstance;

  
  beforeEach(async function() {
    this.project = await TestHelper();
    this.erc20Instance = await ERC20.deployed();
    this.language = "English"

    //builderInstance = await this.project.createProxy(StorageBuilder);
  });

  xit("Deploys a Storage", async function() {
    const erc20Address = this.erc20Instance.address;
    const storageInstance = await this.project.createProxy(StorageContract, {
      initMethod: "initialize",
      initArgs: [this.language, erc20Address]
    });

    assert.isTrue(web3.utils.isAddress(storageInstance.address));
  });

  xit("Should have no languages at first deploy", async function() {
    const builderInstance = await this.project.createProxy(StorageBuilder);
    const languageCount = await builderInstance.methods
      .getStorageCount()
      .call();

    assert.equal(languageCount, 0, "No languages set yet");
  });

  xit("Should add a language when a storage is deployed", async function() {
    const deployStorage = await builderInstance.methods
      .deployStorage("English")
      .send({ from: accounts[0], gas: 5000000 });
    const languageCount = await builderInstance.methods
      .getStorageCount()
      .call();
    ////console.log("Languages: ", languageCount);
    assert.equal(languageCount, 1, "One Language set");
  });

  xit("Should deploy multiple languages", async function() {
    await builderInstance.methods
      .deployStorage("English")
      .send({ from: accounts[0], gas: 5000000 });
    await builderInstance.methods
      .deployStorage("Spanish")
      .send({ from: accounts[0], gas: 5000000 });
    await builderInstance.methods
      .deployStorage("Russian")
      .send({ from: accounts[0], gas: 5000000 });
    const languageCount = await builderInstance.methods
      .getStorageCount()
      .call();
    assert.equal(languageCount, 3, "Three languages set");
  });

  xit("Should return the language of the storage deployed", async function() {
    await builderInstance.methods
      .deployStorage("English")
      .send({ from: accounts[0], gas: 5000000 });
    await builderInstance.methods
      .deployStorage("Spanish")
      .send({ from: accounts[0], gas: 5000000 });
    const languageCount = await builderInstance.methods.languages(1).call();
    assert.equal(languageCount, "Spanish", "Correct language returned");
  });

  xit("Emits and Event with Address when Storage is deployed", async function() {
    const result = await builderInstance.methods
      .deployStorage("English")
      .send({ from: accounts[0], gas: 5000000 });
    //truffleAssert.eventEmitted(result, 'storageCreated', function (x) {//console.log(x)});
    //truffleAssert.prettyPrintEmittedEvents(result);
    const { events } = result;
    const eventResult = events.storageCreated.returnValues;
    ////console.log(eventResult);
    assert.isTrue(web3.utils.isAddress(eventResult[0]));
  });

  xit("Should save the address of the deployed storage", async function() {
    const result = await builderInstance.methods
      .deployStorage("English")
      .send({ from: accounts[0], gas: 5000000 });
    let numberOfLanguages = await builderInstance.methods
      .getStorageCount()
      .call();
    const { events } = result;
    const eventResult = events.storageCreated.returnValues;

    numberOfLanguages = Number(numberOfLanguages);
    const languageAddress = await builderInstance.methods
      .storageLocations(numberOfLanguages - 1)
      .call();
    assert.equal(
      eventResult[0],
      languageAddress,
      "The address deployed is the same"
    );
  });

  xit("Should Deploy a storage", async function() {
    const result = await builderInstance.methods
      .deployStorage("German")
      .send({ from: accounts[0], gas: 5000000 });
    let numberOfLanguages = await builderInstance.methods
      .getStorageCount()
      .call();
    numberOfLanguages = Number(numberOfLanguages);

    const { events } = result;
    const eventResult = events.storageCreated.returnValues;

    const storageContract = await StorageContract.at(eventResult[0]);
    const storageName = await storageContract.methods.language().call();
    assert.equal(storageName, "German", "Storage language is not correct.");
  });

  xit("Deployed storage should save a word", async function() {
    const result = await builderInstance.methods
      .deployStorage("German")
      .send({ from: accounts[0], gas: 5000000 });
    let numberOfLanguages = await builderInstance.methods
      .getStorageCount()
      .call();
    numberOfLanguages = Number(numberOfLanguages);

    const { events } = result;
    const eventResult = events.storageCreated.returnValues;

    const storageContract = await StorageContract.at(eventResult[0]);

    await storageContract.methods
      .setWord("love")
      .send({ from: accounts[0], gas: 900000 });

    const savedWord = await storageContract.methods
      .getWordUint256ToString(0)
      .call();
    assert.equal(savedWord, "love", "Stored word is not correct.");
  });
}); 

contract("WordDao", function(accounts) {
  let daoInstance;
  const language = "english";

  beforeEach(async function() {
    this.project = await TestHelper();
    daoInstance = await this.project.createProxy(WordDaoMaster, {
      initMethod: "initialize",
      initArgs: []
    });
  });

  xit("Should deploy a WordDao", async function() {
    const thisDao = await daoInstance.methods
      .createWordDao(language)
      .send({ from: accounts[0], gas: 5000000 });
    //console.log(thisDao);
  });

  xit("Should deploy an upgradable StorageBuilder", async function() {
    const result = await daoInstance.methods
      .createInstance("0x0", "Test Dow")
      .send({ from: accounts[0], gas: 6000000 });
    //console.log(daoInstance.methods);
    //console.log(result);
  });
});

contract("Storage", function(accounts) {

  const language = "english";
  const symbol = "WDENG";
  const minters = ['0x1eeb9c468707f270f82ba0e04cb413f0af42d094','0xf9cb4c64d9eab3590c3ab96dd7f9986dce293d09'];
  const pausers = minters;
  const signers = minters;

  beforeEach(async function() {
    //this.project = await TestHelper();

    //create Storge builder
    this.storageBuilder = await this.project.createProxy(StorageBuilder);
    this.storage = await this.storageBuilder.methods.deployStorage(language,symbol,minters,pausers,signers).send({from: accounts[0], gas: 6200000});
  });

  it("Deployes a storage builder and deploys an English Storage", async function () {
    console.log(this.storage.address);
  })
});
