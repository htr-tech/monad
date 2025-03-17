require("dotenv").config();
const fs = require("fs");
const chalk = require("chalk");
const { ethers } = require("hardhat");
const inquirer = require("inquirer").default;

async function main() {
    console.log(chalk.blue.bold("[+] Starting BatchSend..."));

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error(chalk.red.bold("[-] Error: Private key not found in .env"));
        process.exit(1);
    }

    const MONAD_RPC_URL = process.env.MONAD_RPC_URL;
    if (!MONAD_RPC_URL) {
        console.error(chalk.red.bold("[-] Error: RPC not found in .env"));
        process.exit(1);
    }

    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    if (!CONTRACT_ADDRESS) {
        console.error(chalk.red.bold("[-] Error: Contract Address not found in .env"));
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(MONAD_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const tokenAbi = [
        "function batchSendNative(address[] calldata recipients, uint256 amount) public payable",
        "event NativeTokensSent(address indexed sender, address[] recipients, uint256 amount)"
    ];

    const bulkSend = new ethers.Contract(CONTRACT_ADDRESS, tokenAbi, wallet);

    // Parse Address List
    if (!fs.existsSync("address.txt")) {
        console.error(chalk.red.bold("[-] Error: address.txt not found"));
        process.exit(1);
    }

    const recipients = fs.readFileSync("address.txt", "utf8")
        .split("\n")
        .map((address) => address.trim())
        .filter((address) => ethers.isAddress(address));

    if (recipients.length === 0) {
        console.error(chalk.red.bold("[-] Error: No valid addresses"));
        process.exit(1);
    }

    console.log(chalk.green.bold(`[+] Found ${recipients.length} valid addresses`));

    // Prompt for amount
    const { amount } = await inquirer.prompt([
        {
            type: "input",
            name: "amount",
            message: "Amount of MON (each):",
            validate: (input) => {
                if (isNaN(input) || Number(input) <= 0) {
                    return "Please enter a valid positive number";
                }
                return true;
            },
        },
    ]);

    const amountInWei = ethers.parseEther(amount);
    const totalValue = amountInWei * BigInt(recipients.length);

    console.log(chalk.blue.bold(`[+] Sending ${amount} MON to ${recipients.length} address`));

    // Display addresses
    console.log(chalk.yellow.bold("\n[+] Recipient Addresses:"));
    recipients.forEach((address, index) => {
        console.log(chalk.yellow(`  ${index + 1}. ${address}`));
    });

    console.log("\n");
    const { confirm } = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Proceed with the transaction?",
            default: true,
        },
    ]);

    if (!confirm) {
        console.log(chalk.red.bold("[-] Transaction canceled"));
        process.exit(0);
    }

    // Call bulkSend function
    const tx = await bulkSend.batchSendNative(recipients, amountInWei, {
        value: totalValue,
    });

    console.log(chalk.yellow.bold(`[+] Transaction Hash: ${tx.hash}`));
    await tx.wait();
    console.log(chalk.green.bold("[+] Transaction confirmed!"));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(chalk.red.bold(`[-] Error: ${error.message}`));
        process.exit(1);
    });