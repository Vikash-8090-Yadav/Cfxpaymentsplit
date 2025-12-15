# Conflux Payment Splitter - Frontend

A Next.js frontend application for interacting with the Conflux Payment Splitter smart contract on Conflux eSpace Testnet.

## Features

- 🔗 Wallet connection (MetaMask/Fluent Wallet)
- 👥 Add payees (owner only)
- 💰 Deposit CFX to the contract
- 📊 View contract state and payee information
- 💸 Release payments
- 🔍 Check pending payments for any address

## Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or Fluent Wallet browser extension
- Access to Conflux eSpace Testnet
- Deployed contract address

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your deployed contract address:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy Contract

1. **Using Remix IDE (Recommended for beginners):**
   - Go to [Remix IDE](https://remix.ethereum.org)
   - Create a new file and paste the contract from `../SmartContract/split.sol`
   - Compile with Solidity 0.8.19
   - Connect MetaMask/Fluent Wallet
   - Switch to Conflux eSpace Testnet
   - Deploy the contract
   - Copy the contract address

2. **Using Hardhat:**
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network confluxTestnet
   ```

3. **Using Foundry:**
   ```bash
   forge build
   forge script script/Deploy.s.sol --rpc-url https://evmtestnet.confluxrpc.com --broadcast
   ```

### Deploy Frontend

#### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. Deploy

#### Other Platforms

Build the production bundle:

```bash
npm run build
npm start
```

## Conflux eSpace Testnet Setup

### Add Network to MetaMask

1. Open MetaMask
2. Go to Settings > Networks > Add Network
3. Use these details:
   - **Network Name:** Conflux eSpace Testnet
   - **RPC URL:** https://evmtestnet.confluxrpc.com
   - **Chain ID:** 71
   - **Currency Symbol:** CFX
   - **Block Explorer:** https://evmtestnet.confluxscan.net

### Get Testnet CFX

Visit the [Conflux Faucet](https://faucet.confluxnetwork.org/) to get testnet CFX.

## Usage

1. **Connect Wallet:**
   - Click "Connect Wallet" button
   - Approve the connection in your wallet
   - Make sure you're on Conflux eSpace Testnet

2. **Add Payees (Owner Only):**
   - Enter payee address and shares
   - Click "Add Payee"
   - Confirm transaction in wallet

3. **Deposit CFX:**
   - Enter amount to deposit
   - Click "Deposit"
   - Confirm transaction in wallet

4. **View Payees:**
   - All payees are listed on the right side
   - Shows address, shares, and pending amount

5. **Release Payment:**
   - If you're a payee, click "Release" next to your address
   - Or use "Release My Payment" button
   - Confirm transaction in wallet

6. **Check Pending:**
   - Enter any address to check pending payment
   - Click "Check Pending"

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── WalletButton.tsx    # Wallet connection component
│   ├── ContractInfo.tsx   # Contract state display
│   └── PayeeList.tsx       # Payee list component
├── lib/
│   └── web3.ts             # Web3 service and utilities
├── contracts/
│   └── abi.json            # Contract ABI
└── scripts/
    └── deploy-contract.js  # Deployment helper script
```

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Ethers.js v6** - Ethereum/Conflux interaction
- **Conflux eSpace** - EVM-compatible blockchain

## Troubleshooting

### Wallet Connection Issues

- Make sure MetaMask/Fluent Wallet is installed
- Check that you're on Conflux eSpace Testnet
- Try refreshing the page

### Contract Not Found

- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly
- Make sure the contract is deployed on Conflux eSpace Testnet
- Check the contract address in [ConfluxScan](https://evmtestnet.confluxscan.net)

### Transaction Failures

- Ensure you have enough CFX for gas
- Check that you're the owner for owner-only functions
- Verify all input parameters are correct

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

