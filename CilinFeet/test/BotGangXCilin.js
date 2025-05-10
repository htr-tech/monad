const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BotGangXCilin", function () {
    let BotGangXCilin, botGangXCilin, owner, addr1, addr2, royaltyReceiver;

    beforeEach(async function () {
        [owner, addr1, addr2, royaltyReceiver] = await ethers.getSigners();
        BotGangXCilin = await ethers.getContractFactory("BotGangXCilin");
        botGangXCilin = await BotGangXCilin.deploy(owner.address, royaltyReceiver.address);
        await botGangXCilin.waitForDeployment();
    });

    it("mint token", async function () {
        await botGangXCilin.mint(addr1.address);
        expect(await botGangXCilin.ownerOf(1)).to.equal(addr1.address);
    });

    it("multisend token", async function () {
        await botGangXCilin.multiSend([addr1.address, addr2.address]);
        expect(await botGangXCilin.ownerOf(1)).to.equal(addr1.address);
        expect(await botGangXCilin.ownerOf(2)).to.equal(addr2.address);
    });

    it("freeze trading", async function () {
        await botGangXCilin.mint(addr1.address);
        await botGangXCilin.setTradingFrozen(true);
        await expect(
            botGangXCilin.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
        ).to.be.revertedWith("Trading is frozen");
    });

    it("unfreeze trading", async function () {
        await botGangXCilin.mint(addr1.address);
        await botGangXCilin.setTradingFrozen(false);
        await expect(botGangXCilin.connect(addr1).transferFrom(addr1.address, addr2.address, 1));
    });

    it("burn token", async function () {
        await botGangXCilin.mint(addr1.address);
        await botGangXCilin.connect(addr1).burn(1);
        await expect(botGangXCilin.ownerOf(1)).to.be.reverted;
    });

    it("max supply", async function () {
        for (let i = 0; i < 691; i++) {
            await botGangXCilin.mint(addr1.address);
        }
        await expect(botGangXCilin.mint(addr1.address)).to.be.revertedWith("Max supply reached");
    });

    it("royalty info", async function () {
        await botGangXCilin.mint(addr1.address);
        const [receiver, amount] = await botGangXCilin.royaltyInfo(1, 10000);
        expect(receiver).to.equal(royaltyReceiver.address);
        expect(amount).to.equal(200); // 2% of 10000
    });

    it("print tokenURIs and contractURI", async function () {
        // Mint up to 691 tokens
        for (let i = 0; i < 691; i++) {
            await botGangXCilin.mint(owner.address);
        }

        // Token IDs to inspect
        const tokenIds = [1, 691];
        for (const id of tokenIds) {
            const uri = await botGangXCilin.tokenURI(id);
            console.log(`Token ${id} Metadata:`);
            console.log(uri);
        }

        // Print contract URI
        const contractUri = await botGangXCilin.contractURI();
        console.log("Contract Metadata URI:");
        console.log(contractUri);
    });
});
