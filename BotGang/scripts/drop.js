require("dotenv").config();
const fs = require("fs");
const { ethers } = require("hardhat");

// Config
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.MONAD_RPC_URL;
const ABI = [
    "function multiSend(address[] recipients, uint256 amount) external",
    "function totalSupply() external view returns (uint256)",
    "function MAX_SUPPLY() external view returns (uint256)"
];

async function main() {
    // Read addresses
    const addresses = fs.readFileSync("address.txt", "utf8")
        .split("\n")
        .map((address) => address.trim())
        .filter((address) => ethers.isAddress(address));

    if (addresses.length === 0) {
        throw new Error("No valid addresses found in address.txt");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // contract state
    const [currentSupply, maxSupply] = await Promise.all([
        contract.totalSupply(),
        contract.MAX_SUPPLY()
    ]);

    console.log(`Current Supply: ${currentSupply}`);
    console.log(`Max Supply: ${maxSupply}`);
    console.log(`Addresses to mint for: ${addresses.length}`);

    const addycount = BigInt(addresses.length);
    if (currentSupply + addycount > maxSupply) {
        throw new Error(`Minting ${addresses.length} would exceed max supply`);
    }

    // Execute multiSend
    console.log(`\nMinting 1 NFT for ${addresses.length} addresses...`);
    const tx = await contract.multiSend(addresses, 1);
    console.log(`Txn sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    const newSupply = await contract.totalSupply();
    console.log(`\nNew Supply: ${newSupply}`);
    console.log(`Successfully minted ${newSupply - currentSupply} NFTs`);
}

main().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
