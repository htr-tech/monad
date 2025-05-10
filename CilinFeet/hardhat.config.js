require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            metadata: {
                bytecodeHash: "none",
                useLiteralContent: true,
            },
        },
    },
    networks: {
        monadtestnet: {
            url: process.env.MONAD_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
