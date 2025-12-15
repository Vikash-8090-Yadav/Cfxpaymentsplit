require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Conflux eSpace Testnet
    confluxTestnet: {
      url: process.env.CONFLUX_TESTNET_RPC_URL || "https://evmtestnet.confluxrpc.com",
      chainId: 71,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Remove gasPrice to let Hardhat auto-detect from network
      // If auto-detect fails, uncomment and use a higher value:
      // gasPrice: 10000000000, // 10 gwei
    },
    // Conflux eSpace Mainnet
    confluxMainnet: {
      url: process.env.CONFLUX_MAINNET_RPC_URL || "https://evm.confluxrpc.com",
      chainId: 1030,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Remove gasPrice to let Hardhat auto-detect from network
      // If auto-detect fails, uncomment and use a higher value:
      // gasPrice: 10000000000, // 10 gwei
    },
    // Local Hardhat Network
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      confluxTestnet: process.env.CONFLUXSCAN_API_KEY || "",
      confluxMainnet: process.env.CONFLUXSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "confluxTestnet",
        chainId: 71,
        urls: {
          apiURL: "https://evmtestnet.confluxscan.net/api",
          browserURL: "https://evmtestnet.confluxscan.net",
        },
      },
      {
        network: "confluxMainnet",
        chainId: 1030,
        urls: {
          apiURL: "https://evm.confluxscan.net/api",
          browserURL: "https://evm.confluxscan.net",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

