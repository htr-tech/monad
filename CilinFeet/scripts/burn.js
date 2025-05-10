require("dotenv").config();
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function burnNFT() {
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

    // Get tokenId to burn
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "tokenId",
            message: "Enter token ID to burn:",
            validate: (input) => {
                const tokenId = parseInt(input);
                if (isNaN(tokenId) || tokenId < 1) return "Token ID must be a positive integer";
                return true;
            },
        },
        {
            type: "confirm",
            name: "confirm",
            message: "This will permanently burn the NFT. Continue?",
            default: false,
        },
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Burn cancelled"));
        process.exit(0);
    }

    const tokenId = parseInt(answers.tokenId);

    // Load contract
    const BotGangXCilin = await hre.ethers.getContractAt("BotGangXCilin", NFT_CONTRACT, wallet);
    console.log(chalk.blue(`\n[i] NFT Contract: ${NFT_CONTRACT}`));

    // Burn NFT
    try {
        console.log(chalk.blue.bold(`[+] Burning NFT with tokenId ${tokenId}...`));

        // Check if token exists
        try {
            await BotGangXCilin.ownerOf(tokenId);
        } catch {
            throw new Error(`Token ID ${tokenId} does not exist or is already burned`);
        }

        // Check if wallet owns the token or is approved
        const owner = await BotGangXCilin.ownerOf(tokenId);
        const isApproved = await BotGangXCilin.getApproved(tokenId) === wallet.address;
        const isOperator = await BotGangXCilin.isApprovedForAll(owner, wallet.address);
        if (owner.toLowerCase() !== wallet.address.toLowerCase() && !isApproved && !isOperator) {
            throw new Error("You are not the owner or approved to burn this token");
        }

        // Send burn transaction
        const tx = await BotGangXCilin.burn(tokenId);
        console.log(chalk.blue(`[i] Transaction hash: ${tx.hash}`));

        const receipt = await tx.wait();
        console.log(chalk.green.bold(`[+] NFT with tokenId ${tokenId} burned successfully!`));

        // Log gas used and updated supply
        console.log(chalk.blue(`[i] Gas used: ${receipt.gasUsed.toString()}`));
        // console.log(chalk.blue(`[i] Total supply: ${await BotGangXCilin.totalSupply()} / ${await BotGangXCilin.maxSupply()}`));
    } catch (error) {
        console.error(chalk.red.bold("[-] Burn failed:"), error.message);
        process.exit(1);
    }
}

burnNFT().catch((error) => {
    console.error(chalk.red.bold("\n[-] Script failed:"), error);
    process.exit(1);
});
