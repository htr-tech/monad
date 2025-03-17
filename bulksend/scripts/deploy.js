require("dotenv").config();
const fs = require("fs");
const hre = require("hardhat");
const chalk = require("chalk");

async function deployContract() {
    console.log(chalk.blue.bold("[+] Deploying Contract..."));

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error(chalk.red.bold("[-] Private key not found in .env"));
        process.exit(1);
    }

    const [deployer] = await hre.ethers.getSigners();
    console.log(chalk.blue.bold(`[+] Deploying on wallet: ${deployer.address}`));

    const BulkSend = await hre.ethers.getContractFactory("BulkSend");
    const bulkSend = await BulkSend.deploy();
    await bulkSend.waitForDeployment();

    const contractAddress = await bulkSend.getAddress();
    console.log(chalk.green.bold(`[+] Contract Address: ${contractAddress}`));

    saveContract(contractAddress);
}

function saveContract(contractAddress) {
    const envPath = ".env";
    let envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes("CONTRACT_ADDRESS=")) {
        envContent = envContent.replace(
            /CONTRACT_ADDRESS=.*/,
            `CONTRACT_ADDRESS=${contractAddress}`
        );
    } else {
        envContent += `\nCONTRACT_ADDRESS=${contractAddress}`;
    }
    fs.writeFileSync(envPath, envContent);
}

deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(chalk.red.bold(`[-] Error: ${error.message}`));
        process.exit(1);
    });
