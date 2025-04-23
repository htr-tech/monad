require("@nomicfoundation/hardhat-toolbox");

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
      url: "https://testnet-rpc.monad.xyz/",
    },
  },
  etherscan: {
    enabled: false,
  },
};
