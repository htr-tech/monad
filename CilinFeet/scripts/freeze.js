require("dotenv").config();
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function toggleTrading() {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const NFT_CONTRACT = process.env.NFT_CONTRACT;
    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;

    if (!PRIVATE_KEY || !NFT_CONTRACT || !MONAD_RPC_URL) {
        console.error(chalk.red.bold("[-] Error: Missing in .env"));
        process.exit(1);
    }

    // Setup
    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green(`[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${hre.ethers.formatEther(await provider.getBalance(wallet.address))} MON\n`));

    // Load contract
    const BotGangXCilin = await hre.ethers.getContractAt("BotGangXCilin", NFT_CONTRACT, wallet);
    console.log(chalk.blue(`[i] Contract Address: ${NFT_CONTRACT}`));

    const isFrozen = await BotGangXCilin.isTradingFrozen();
    console.log(chalk.blue(`[i] Current state: ${isFrozen ? "Frozen" : "Unfrozen"}`));

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Option:",
            choices: ["Freeze", "Unfreeze"],
        },
        {
            type: "confirm",
            name: "confirm",
            message: (answers) => `${answers.action.toLowerCase()} trading. Continue?`,
            default: true,
        },
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Action cancelled"));
        process.exit(0);
    }

    const freeze = answers.action === "Freeze";

    // Toggle trading
    try {
        console.log(chalk.blue.bold(`[+] ${freeze ? "Freezing" : "Unfreezing"} trading...`));

        // Check if sender is owner
        const owner = await BotGangXCilin.owner();
        if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
            throw new Error("Only the contract owner can toggle trading");
        }

        // Check if state is already set
        if (isFrozen === freeze) {
            console.log(chalk.yellow(`[i] Trading is already ${freeze ? "frozen" : "unfrozen"}`));
            process.exit(0);
        }

        // Send transaction
        const tx = await BotGangXCilin.setTradingFrozen(freeze);
        console.log(chalk.blue(`[i] Transaction hash: ${tx.hash}`));

        const receipt = await tx.wait();
        console.log(chalk.green.bold(`[+] Trading ${freeze ? "frozen" : "unfrozen"} successfully!`));

        // Log gas used and new trading state
        console.log(chalk.blue(`[i] Gas used: ${receipt.gasUsed.toString()}`));
        console.log(chalk.blue(`[i] New trading state: ${(await BotGangXCilin.isTradingFrozen()) ? "Frozen" : "Unfrozen"}`));
        // console.log(chalk.blue(`[i] Total supply: ${await BotGangXCilin.totalSupply()} / ${await BotGangXCilin.maxSupply()}`));
    } catch (error) {
        console.error(chalk.red.bold("[-] Action failed:"), error.message);
        if (error.data) {
            console.error(chalk.red("[i] Revert data:"), error.data);
        }
        process.exit(1);
    }
}

toggleTrading().catch((error) => {
    console.error(chalk.red.bold("\n[-] Script failed:"), error);
    process.exit(1);
});