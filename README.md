# Conflux Payment Splitter

A dynamic payment splitter smart contract for Conflux eSpace with a Next.js frontend interface.

## 📋 Overview

The Conflux Payment Splitter allows you to:
- Dynamically add payees after contract deployment
- Automatically split CFX payments proportionally based on shares
- Release payments on-demand (pull payment model)
- View contract state and pending payments

## 🏗️ Project Structure

```
Cfxpaymentsplit/
├── SmartContract/
│   └── split.sol              # Solidity smart contract
├── frontend/                  # Next.js frontend application
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── lib/                   # Web3 utilities
│   └── contracts/             # Contract ABI
├── DEPLOYMENT_GUIDE.md        # Complete deployment guide
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Deploy Smart Contract

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick deploy using Remix:**
1. Go to [Remix IDE](https://remix.ethereum.org)
2. Paste contract from `SmartContract/split.sol`
3. Compile with Solidity 0.8.19+
4. Deploy to Conflux eSpace Testnet
5. Copy contract address

### 2. Setup Frontend

```bash
cd frontend
npm install
cp env.example .env
# Edit .env and add your contract address
npm run dev
```

Visit `http://localhost:3000` and connect your wallet!

## 📚 Documentation

- **[Frontend README](./frontend/README.md)** - Frontend setup and usage
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Smart Contract](./SmartContract/split.sol)** - Contract source code

## 🔧 Features

### Smart Contract
- ✅ Dynamic payee management
- ✅ Proportional share-based distribution
- ✅ Pull payment model (gas efficient)
- ✅ Owner-controlled administration
- ✅ Full event transparency

### Frontend
- ✅ Wallet connection (MetaMask/Fluent)
- ✅ Add payees (owner only)
- ✅ Deposit CFX
- ✅ View all payees and balances
- ✅ Release payments
- ✅ Check pending amounts

## 🌐 Network

**Conflux eSpace Testnet:**
- RPC: `https://evmtestnet.confluxrpc.com`
- Chain ID: `71`
- Explorer: `https://evmtestnet.confluxscan.net`
- Faucet: `https://faucet.confluxnetwork.org/`

## 📝 License

MIT License - see [LICENSE](./LICENSE) file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.