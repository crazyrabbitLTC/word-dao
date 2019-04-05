const { TestHelper } = require("zos");
const { Contracts, ZWeb3 } = require("zos-lib");
const truffleAssert = require("truffle-assertions");

const {
  BN,
  constants,
  expectEvent,
  shouldFail
} = require("openzeppelin-test-helpers");
const { expect } = require("chai");

ZWeb3.initialize(web3.currentProvider);

const Storage = Contracts.getFromLocal("DaoStorage");
//const ERC20 = Contracts.getFromNodeModules("openzeppelin-eth", "ERC20");
const ERC20 = Contracts.getFromNodeModules(
  "openzeppelin-eth",
  "StandaloneERC20"
);
const Manager = Contracts.getFromLocal("Manager");

require("chai").should();

contract("Storage", function(accounts) {
  before(async function() {
    this.project = await TestHelper();
    this.wordDao = await this.project.createProxy(Storage, {
      initMethod: "initialize",
      initArgs: ["english"]
    });
  });

  it("should create an english language wordDao proxy", async function() {
    const result = await this.wordDao.methods.language().call();
    result.should.eq("english");
  });

  it("should store a word", async function() {
    const word = "hello";
    const { events } = await this.wordDao.methods
      .setWord(word)
      .send({ from: accounts[0], gas: 5000000 });

    assert.equal(word, events.wordAdded.returnValues[0]);
  });

  it("should return a word by index", async function() {
    const result = await this.wordDao.methods.getWordUint256ToString(0).call();
    assert.equal(result, "hello");
  });

  it("should return an index by word", async function() {
    const result = await this.wordDao.methods
      .getWordStringToUint256("hello")
      .call();
    assert.equal(result, 0);
  });
});

contract("Manager", function(accounts) {
  const address = "0x2B66D518350ccC137E28cECc3693169bA79AD9B6";

  const storageDefinition = {
    language: "english",
    name: "EnglishDao",
    symbol: "ED",
    decimals: 18,
    initialSupply: 0,
    initialHolder: address,
    minters: [],
    pausers: []
  };

  before(async function() {
    this.project = await TestHelper();
    this.manager = await this.project.createProxy(Manager);
  });

  it("should create a DaoStorage", async function() {
    const {
      language,
      name,
      symbol,
      decimals,
      initialSupply,
      initialHolder,
      minters,
      pausers
    } = storageDefinition;

    const result = await this.manager.methods
      .createStorage(
        language,
        name,
        symbol,
        decimals,
        initialSupply,
        initialHolder,
        minters,
        pausers
      )
      .send({ from: accounts[0], gas: 5000000 });

    const event = result.events.daoStorageCreated.returnValues;

    assert.equal(event[0], language);
  });
});

contract("Token", function(accounts) {
  const address = "0x2B66D518350ccC137E28cECc3693169bA79AD9B6";

  const storageDefinition = {
    language: "english",
    name: "EnglishDao",
    symbol: "ED",
    decimals: 18,
    initialSupply: 0,
    initialHolder: address,
    minters: [],
    pausers: []
  };

  before(async function() {
    this.project = await TestHelper();
    this.manager = await this.project.createProxy(Manager);
    this.tokenAddress = "";
    this.storageAddress = "";
  });

  it("should create a DaoStorage", async function() {
    const {
      language,
      name,
      symbol,
      decimals,
      initialSupply,
      initialHolder,
      minters,
      pausers
    } = storageDefinition;

    const result = await this.manager.methods
      .createStorage(
        language,
        name,
        symbol,
        decimals,
        initialSupply,
        initialHolder,
        [this.manager.address, accounts[0]],
        pausers
      )
      .send({ from: accounts[0], gas: 5000000 });

    const event = result.events.daoStorageCreated.returnValues;
    this.tokenAddress = event[1];
    this.storageAddress = event[2];
    this.token = await ERC20.at(this.tokenAddress);

    assert.equal(event[0], language);
  });

  it("should have deployed a token for the DaoSTorage with no supply(yet)", async function() {
    const token = await ERC20.at(this.tokenAddress);
    const result = await token.methods.totalSupply().call();
    assert.equal(result, 0);
  });

  it("Should have stored the address for it's token", async function() {
    const result = await this.manager.methods.token().call();
    assert.equal(result, this.tokenAddress);
  });

  it("should have deployed a daoStorage for the proper language", async function() {
    const storage = await Storage.at(this.storageAddress);
    const result = await storage.methods.language().call();
    assert.equal(result, storageDefinition.language);
  });

  it("manager should be allowed to mint a token", async function() {
    const result = await this.token.methods
      .isMinter(this.manager.address)
      .call();
    assert.equal(result, true);
  });

  it("This test should be allowed to mint a token", async function() {
    const result = await this.token.methods.isMinter(accounts[0]).call();
    assert.equal(result, true);
  });

  xit("token should mint tokens", async function() {
    await this.token.methods
      .mint(accounts[0], 1)
      .send({ from: accounts[0], gas: 5000000 });
    await this.token.methods
      .mint(accounts[0], 1)
      .send({ from: accounts[0], gas: 5000000 });
    const result = await this.token.methods.totalSupply().call();
    assert.equal(result, 2);
  });

  xit("Manager should mint tokens", async function() {
    await this.manager.methods
      .testMintToken(accounts[0], 1)
      .send({ from: accounts[0], gas: 5000000 });
    const result = await this.token.methods.totalSupply().call();
    assert.equal(result, 3);
  });

  it("should add a word via the manager", async function() {
    const word = "Love";
    const word2 = "Happy";
    const storage = Storage.at(this.storageAddress);

    await this.manager.methods
      .addWord(word)
      .send({ from: accounts[0], gas: 5000000 });

    await this.manager.methods
      .addWord(word2)
      .send({ from: accounts[0], gas: 5000000 });

    await this.manager.methods
      .addWord(word2)
      .send({ from: accounts[1], gas: 5000000 });

    const result = await storage.methods.totalWords().call();
    const tx = await this.token.methods.totalSupply().call();
    assert.equal(new BN(3), result);
  });

  it("Should have a balance of two tokens for accounts[0]", async function() {
    const balance = await this.token.methods.balanceOf(accounts[0]).call();
    assert.equal(new BN(2), balance);
  });

  it("Should have a balance of one tokens for accounts[1]", async function() {
    const balance = await this.token.methods.balanceOf(accounts[1]).call();
    assert.equal(new BN(1), balance);
  });
});
