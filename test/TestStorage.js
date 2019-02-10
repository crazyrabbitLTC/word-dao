
const StorageBuilder = artifacts.require("StorageBuilder");

contract('builder', (accounts)=> {

    xit("Should have no languages at first deploy", async () => {
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
    xit("Should add a language when a storage is deployed", async () => {
        const builderInstance = await StorageBuilder.deployed();
        const deployStorage = await builderInstance.deployStorage("English");
        const languageCount = await builderInstance.getStorageCount();
        console.log("Languages: ", languageCount);
        assert.equal(languageCount, 1, "One Language set");
    })

    xit("Should deploy multiple languages", async () => {
        const builderInstance = await StorageBuilder.deployed();
        await builderInstance.deployStorage("English");
        await builderInstance.deployStorage("Spanish");
        const languageCount = await builderInstance.getStorageCount();
        assert.equal(languageCount,3, "Three languages set");
    })

    xit("Should return the language of the storage deployed", async () => {
        const builderInstance = await StorageBuilder.deployed();
        await builderInstance.deployStorage("English");
        await builderInstance.deployStorage("Spanish");
        const languageCount = await builderInstance.languages(2);
        assert.equal(languageCount,"Spanish", "Correct language returned");
    })

    it("Should save the address of the deployed storage", async () => {
        const builderInstance = await StorageBuilder.deployed();
        const deployedStorageAddress = await builderInstance.deployStorage("German");
        const numberOfLanguage = await builderInstance.getStorageCount();
        const eventArgs = deployedStorageAddress.logs[0].args;
        const number = numberOfLanguage.toNumber();
        //console.log(typeof(number));
        const addressInArray = await builderInstance.storageLocations(number-1);
        assert.equal(eventArgs._address, addressInArray, "The address deployed is the same");
        //console.log(deployedStorageAddress.logs[0].args);

    })



})