const { TestHelper } = require("zos");
const { Contracts, ZWeb3 } = require("zos-lib");

ZWeb3.initialize(web3.currentProvider);

const Storage = Contracts.getFromLocal("Storage");
const ERC20 = Contracts.getFromNodeModules("openzeppelin-eth", "ERC20");

require("chai").should();

contract("Storage", function(accounts) {
  const wordArray = [];

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
    wordArray.push(events.wordAdded.returnValues);
    //console.info(wordArray[0]._wordBytes32);
    assert.equal(word, events.wordAdded.returnValues[0]);
  });

  it("should return a word by index", async function() {
    const result = await this.wordDao.methods.getWordUint256ToString(0).call();
    assert.equal(result, "hello");
  });

  it("should return an index by word", async function() {
    const result = await this.wordDao.methods.getWordStringToUint256("hello").call();
    assert.equal(result, 0);
  });

  // xit("should create a proxy for the ERC20", async function() {
  //   const proxy = await this.project.createProxy(ERC20, {
  //     contractName: "StandaloneERC20",
  //     packageName: "openzeppelin-eth"
  //   });
  //   const result = await proxy.methods.totalSupply().call();
  //   result.should.eq("0");
  // });
});
