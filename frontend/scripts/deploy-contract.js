/**
 * Deployment script for ConfluxPaymentSplitter
 * 
 * Usage:
 *   node scripts/deploy-contract.js
 * 
 * Make sure to set your private key in .env file:
 *   PRIVATE_KEY=your_private_key_here
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Conflux eSpace Testnet RPC
const RPC_URL = 'https://evmtestnet.confluxrpc.com';
const CHAIN_ID = 71;

async function deploy() {
  console.log('🚀 Deploying ConfluxPaymentSplitter to Conflux eSpace Testnet...\n');

  // Check for private key
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Error: PRIVATE_KEY not found in .env file');
    console.log('Please create a .env file with your private key:');
    console.log('PRIVATE_KEY=your_private_key_here');
    process.exit(1);
  }

  // Read contract source
  const contractPath = path.join(__dirname, '../../SmartContract/split.sol');
  if (!fs.existsSync(contractPath)) {
    console.error('❌ Error: Contract file not found at', contractPath);
    process.exit(1);
  }

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log('📝 Deploying from address:', wallet.address);
  console.log('💰 Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'CFX\n');

  // Read contract ABI (we'll need to compile first or use hardhat/forge)
  // For now, we'll use a simple bytecode approach
  // Note: You'll need to compile the contract first using Hardhat, Foundry, or Remix
  
  console.log('⚠️  Note: This script requires the contract to be compiled first.');
  console.log('Please use one of these methods:');
  console.log('1. Use Remix IDE: https://remix.ethereum.org');
  console.log('2. Use Hardhat: npx hardhat compile');
  console.log('3. Use Foundry: forge build\n');
  
  console.log('After compilation, you can deploy using:');
  console.log('- Remix IDE (recommended for beginners)');
  console.log('- Hardhat deploy script');
  console.log('- Foundry forge script\n');

  console.log('📋 Contract deployment steps:');
  console.log('1. Go to https://remix.ethereum.org');
  console.log('2. Create a new file and paste the contract code');
  console.log('3. Compile the contract (Solidity 0.8.19)');
  console.log('4. Go to Deploy tab');
  console.log('5. Select "Injected Provider - MetaMask"');
  console.log('6. Make sure you\'re on Conflux eSpace Testnet');
  console.log('7. Deploy the contract');
  console.log('8. Copy the deployed contract address');
  console.log('9. Update NEXT_PUBLIC_CONTRACT_ADDRESS in frontend/.env\n');

  // Alternative: If you have compiled bytecode, you can deploy programmatically
  // const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  // const contract = await contractFactory.deploy();
  // await contract.waitForDeployment();
  // console.log('✅ Contract deployed at:', await contract.getAddress());
}

deploy().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});

