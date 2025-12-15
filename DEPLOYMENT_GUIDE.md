# Deployment Guide - Conflux Payment Splitter

Complete guide to deploy the Conflux Payment Splitter contract and frontend on Conflux eSpace Testnet.

## Prerequisites

1. **Wallet Setup:**
   - Install [MetaMask](https://metamask.io/) or [Fluent Wallet](https://fluentwallet.com/)
   - Get testnet CFX from [Conflux Faucet](https://faucet.confluxnetwork.org/)

2. **Add Conflux eSpace Testnet to MetaMask:**
   - Network Name: `Conflux eSpace Testnet`
   - RPC URL: `https://evmtestnet.confluxrpc.com`
   - Chain ID: `71`
   - Currency Symbol: `CFX`
   - Block Explorer: `https://evmtestnet.confluxscan.net`

## Step 1: Deploy Smart Contract

### Option A: Using Remix IDE (Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org)

2. Create a new file `ConfluxPaymentSplitter.sol` in the contracts folder

3. Copy and paste the contract code from `SmartContract/split.sol`

4. **Compile:**
   - Go to "Solidity Compiler" tab
   - Select compiler version: `0.8.19` or higher
   - Click "Compile ConfluxPaymentSplitter.sol"
   - Check for any errors

5. **Deploy:**
   - Go to "Deploy & Run Transactions" tab
   - Select environment: `Injected Provider - MetaMask`
   - Make sure MetaMask is connected and on Conflux eSpace Testnet
   - Click "Deploy"
   - Confirm transaction in MetaMask
   - Wait for deployment confirmation

6. **Copy Contract Address:**
   - After deployment, copy the contract address from Remix
   - Save it for the frontend configuration

### Option B: Using Hardhat

1. Install Hardhat:
```bash
npm install --save-dev hardhat
npx hardhat init
```

2. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    confluxTestnet: {
      url: "https://evmtestnet.confluxrpc.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

3. Create deployment script `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const ConfluxPaymentSplitter = await hre.ethers.getContractFactory("ConfluxPaymentSplitter");
  const splitter = await ConfluxPaymentSplitter.deploy();
  await splitter.waitForDeployment();
  console.log("Contract deployed to:", await splitter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Deploy:
```bash
npx hardhat run scripts/deploy.js --network confluxTestnet
```

### Option C: Using Foundry

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Initialize project:
```bash
forge init
```

3. Copy contract to `src/ConfluxPaymentSplitter.sol`

4. Deploy:
```bash
forge create ConfluxPaymentSplitter \
  --rpc-url https://evmtestnet.confluxrpc.com \
  --private-key YOUR_PRIVATE_KEY
```

## Step 2: Verify Contract (Optional but Recommended)

1. Go to [ConfluxScan Testnet](https://evmtestnet.confluxscan.net)
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Enter contract details and verify

## Step 3: Setup Frontend

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Create environment file:**
```bash
cp env.example .env
```

4. **Update `.env` file:**
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Replace `0xYourDeployedContractAddress` with the contract address from Step 1.

5. **Run development server:**
```bash
npm run dev
```

6. **Open browser:**
   - Navigate to `http://localhost:3000`
   - Connect your wallet
   - Make sure you're on Conflux eSpace Testnet

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. Push code to GitHub repository

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "New Project"

4. Import your GitHub repository

5. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Environment Variables:
     - `NEXT_PUBLIC_CONTRACT_ADDRESS` = your contract address

6. Click "Deploy"

7. Your app will be live at `https://your-project.vercel.app`

### Option B: Netlify

1. Push code to GitHub

2. Go to [Netlify](https://netlify.com) and sign in

3. Click "New site from Git"

4. Select your repository

5. **Build settings:**
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`

6. Add environment variable:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = your contract address

7. Deploy

### Option C: Self-Hosted

1. Build the project:
```bash
cd frontend
npm run build
```

2. Start production server:
```bash
npm start
```

3. Configure your web server (nginx, Apache, etc.) to proxy to port 3000

## Step 5: Test the Application

1. **Connect Wallet:**
   - Click "Connect Wallet"
   - Approve connection in MetaMask
   - Verify you're on Conflux eSpace Testnet

2. **Add Payees (Owner Only):**
   - As the contract owner, add test payees
   - Example: Add address `0x...` with `100` shares

3. **Deposit CFX:**
   - Deposit a small amount (e.g., 1 CFX)
   - Confirm transaction

4. **Check Pending:**
   - Use "Check Pending Payment" to verify payee balances

5. **Release Payment:**
   - As a payee, click "Release" to claim your share
   - Verify CFX is received in wallet

## Troubleshooting

### Contract Deployment Issues

- **Insufficient Gas:** Make sure you have enough CFX for gas fees
- **Wrong Network:** Verify you're on Conflux eSpace Testnet (Chain ID: 71)
- **Compilation Errors:** Check Solidity version matches (0.8.19+)

### Frontend Issues

- **Contract Not Found:** Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is correct
- **Wallet Connection:** Make sure MetaMask is installed and unlocked
- **Network Mismatch:** Frontend will prompt to switch networks automatically

### Transaction Failures

- **Not Owner:** Only owner can add payees
- **Insufficient Balance:** Check you have enough CFX for gas
- **Invalid Address:** Verify all addresses are valid Conflux addresses

## Useful Links

- **Conflux eSpace Testnet Explorer:** https://evmtestnet.confluxscan.net
- **Conflux Faucet:** https://faucet.confluxnetwork.org/
- **Conflux Documentation:** https://developers.confluxnetwork.org/
- **Remix IDE:** https://remix.ethereum.org

## Next Steps

- Deploy to Conflux eSpace Mainnet (change RPC URLs and network settings)
- Add more features (payee removal, share modification, etc.)
- Implement multi-token support
- Add analytics and monitoring

## Support

For issues or questions:
- Check the [README.md](frontend/README.md)
- Open an issue on GitHub
- Visit Conflux Discord community

