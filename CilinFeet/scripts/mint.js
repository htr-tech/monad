require("dotenv").config();
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function mintNFT() {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const NFT_CONTRACT = process.env.NFT_CONTRACT;
    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;

    if (!PRIVATE_KEY || !NFT_CONTRACT || !MONAD_RPC_URL) {
        console.error(chalk.red.bold("[-] Error: Missing required .env variables"));
        process.exit(1);
    }

    // Setup provider and wallet
    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green(`[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${hre.ethers.formatEther(await provider.getBalance(wallet.address))} MON\n`));

    // Get recipient address
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "recipient",
            message: "Enter recipient address:",
            default: wallet.address,
            validate: (input) => hre.ethers.isAddress(input) || "Invalid address",
        },
        {
            type: "confirm",
            name: "confirm",
            message: "This will mint 1 NFT. Continue?",
            default: true,
        },
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Minting cancelled"));
        process.exit(0);
    }

    // Load contract
    const BotGangXCilin = await hre.ethers.getContractAt("BotGangXCilin", NFT_CONTRACT, wallet);
    console.log(chalk.blue(`\n[i] NFT Contract: ${NFT_CONTRACT}`));

    // Mint NFT
    try {
        console.log(chalk.blue.bold("[+] Minting NFT..."));

        // Check if sender is owner (only owner can mint)
        const owner = await BotGangXCilin.owner();
        const isOwner = owner.toLowerCase() === wallet.address.toLowerCase();
        if (!isOwner) {
            throw new Error("Only the contract owner can mint NFTs");
        }

        // Check current supply
        const currentSupply = await BotGangXCilin.totalSupply();
        if (currentSupply >= 691) {
            throw new Error("Max supply of 691 NFTs reached");
        }

        // Send mint transaction
        const tx = await BotGangXCilin.mint(answers.recipient);
        console.log(chalk.blue(`[i] Transaction hash: ${tx.hash}`));

        const receipt = await tx.wait();
        console.log(chalk.green.bold(`[+] NFT minted successfully!`));

        // Log gas used and current supply
        console.log(chalk.blue(`[i] Gas used: ${receipt.gasUsed.toString()}`));
        console.log(chalk.blue(`[i] Total supply: ${await BotGangXCilin.totalSupply()}`));
    } catch (error) {
        console.error(chalk.red.bold("[-] Minting failed:"), error.message);
        process.exit(1);
    }
}

mintNFT().catch((error) => {
    console.error(chalk.red.bold("\n[-] Script failed:"), error);
    process.exit(1);
});