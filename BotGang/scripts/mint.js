require("dotenv").config();
const fs = require("fs");
const hre = require("hardhat");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

async function deployNFT() {
    console.log(chalk.blue.bold("[+] Deploying BotGang NFT..."));

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error(chalk.red.bold("[-] Error: Private key not found in .env"));
        process.exit(1);
    }

    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;
    if (!MONAD_RPC_URL) {
        console.error(chalk.red.bold("[-] Error: RPC URL not found in .env"));
        process.exit(1);
    }

    const answers = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "This will deploy BOTGANG Pass NFT?",
            default: true
        }
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow("[~] Deployment cancelled"));
        process.exit(0);
    }

    const provider = new hre.ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, provider);
    console.log(chalk.green.bold(`\n[+] Using Wallet: ${wallet.address}`));
    console.log(chalk.blue(`[i] Current balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} MON`));

    // Deploy contract
    console.log(chalk.blue.bold("[+] Deploying contract..."));
    const BotGang = await hre.ethers.getContractFactory("BotGang", wallet);
    const botGang = await BotGang.deploy();
    const deploymentTx = botGang.deploymentTransaction();

    console.log(chalk.blue(`[i] Transaction hash: ${deploymentTx.hash}`));
    console.log(chalk.blue(`[i] Waiting for confirmation...`));

    await botGang.waitForDeployment();
    const contractAddress = await botGang.getAddress();

    console.log(chalk.green.bold(`[+] NFT Contract deployed at: ${contractAddress}`));
    console.log(chalk.yellow(`[i] Explorer: https://testnet.monadexplorer.com/address/${contractAddress}`));

    // Save contract address to .env file
    saveContractAddress(contractAddress);

}

function saveContractAddress(contractAddress) {
    const envPath = ".env";
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    const envLines = envContent.split('\n').filter(line => !line.startsWith("NFT_CONTRACT="));
    envLines.push(`NFT_CONTRACT=${contractAddress}`);
    fs.writeFileSync(envPath, envLines.join('\n'));
    console.log(chalk.green.bold("[+] Contract address saved to .env"));
}

deployNFT().catch((error) => {
    console.error(chalk.red.bold("\n[-] Deployment failed:"), error);
    process.exit(1);
});
