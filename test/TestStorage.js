
const StorageBuilder = artifacts.require("StorageBuilder");

contract('builder', (accounts)=> {

    it("should have no languages", async () => {
        const builderInstance = await StorageBuilder.deployed();
        //console.log("Builder Instance", builderInstance);
        const languageCount = await builderInstance.getStorageCount();
        console.log("Language count: ", languageCount);
        assert.equal(languageCount, 0, "No languages set yet");
    })
    // it('Should have language set to English', async () => {
    //     const builderInstance = await builder.deployed('English');
    //     const language = await builderInstance.language.call(accounts[0]);
    //     console.log("Language is: ", language);
    //     assert.equal(language, 'English', "Language set properlly");
    // })
    it("Should add a language when a storage is deployed", async () => {
        const builderInstance = await StorageBuilder.deployed();
        const deployStorage = await builderInstance.deployStorage("English");
        const languageCount = await builderInstance.getStorageCount();
        console.log("Languages: ", languageCount);
        assert.equal(languageCount, 1, "One Language set");

    })


})