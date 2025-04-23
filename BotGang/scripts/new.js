require("dotenv").config();
const fs = require("fs");
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

    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green(`\n[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} MON`));

    // Get recipient address
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "recipient",
            message: "Enter recipient address:",
            default: wallet.address,
            validate: (input) => hre.ethers.isAddress(input) || "Invalid address"
        },
        {
            type: "confirm",
            name: "confirm",
            message: "Continue?",
            default: true
        }
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Minting cancelled"));
        process.exit(0);
    }

    // Load contract
    const BotGang = await hre.ethers.getContractAt("BotGang", NFT_CONTRACT, wallet);
    console.log(chalk.blue(`\n[i] NFT Contract: ${NFT_CONTRACT}`));

    // Mint NFT
    try {
        console.log(chalk.blue.bold("[+] Minting NFT..."));
        const mintPrice = await BotGang.MINT_PRICE();

        if (wallet.address !== await BotGang.owner()) {
            console.log(chalk.yellow(`[i] Mint price: ${ethers.formatEther(mintPrice)} MON`));
        }

        const tx = await BotGang.mint(answers.recipient, {
            value: wallet.address === await BotGang.owner() ? 0 : mintPrice
        });

        console.log(chalk.blue(`[i] Transaction hash: ${tx.hash}`));
        await tx.wait();
        console.log(chalk.green.bold("[+] NFT minted successfully!"));

        // const totalSupply = await BotGang.totalSupply();
        // const tokenId = totalSupply - 1; // Since we just minted the latest

        // console.log(chalk.green(`[+] Token ID: ${tokenId}`));
        // console.log(chalk.yellow(`[i] Explorer: https://testnet.monadexplorer.com/token/${NFT_CONTRACT}?a=${tokenId}`));

    } catch (error) {
        console.error(chalk.red.bold("[-] Minting failed:"), error.message);
        process.exit(1);
    }
}

mintNFT().catch((error) => {
    console.error(chalk.red.bold("\n[-] Script failed:"), error);
    process.exit(1);
});
