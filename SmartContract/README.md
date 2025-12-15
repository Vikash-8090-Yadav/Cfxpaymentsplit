# Conflux Payment Splitter - Smart Contracts

Hardhat project for the Conflux Payment Splitter smart contract.

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- A wallet with CFX for gas fees
- Private key for deployment account

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your private key:

```
PRIVATE_KEY=your_private_key_here
```

⚠️ **WARNING:** Never commit your `.env` file or share your private key!

### 3. Compile Contracts

```bash
npm run compile
```

This will compile the contract and generate artifacts in the `artifacts/` folder.

**Important:** After compiling, copy the ABI to the frontend:

```bash
npm run copy-abi
```

Or use the build command which does both:

```bash
npm run build
```

### 4. Deploy to Conflux eSpace Testnet

```bash
npm run deploy:testnet
```

Or manually:

```bash
npx hardhat run scripts/deploy.js --network confluxTestnet
```

### 5. Verify Contract (Optional)

After deployment, verify the contract on ConfluxScan:

```bash
npx hardhat verify --network confluxTestnet <CONTRACT_ADDRESS>
```

Or use the verify script:

```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network confluxTestnet
```

## 📁 Project Structure

```
SmartContract/
├── contracts/
│   └── ConfluxPaymentSplitter.sol    # Main contract
├── scripts/
│   ├── deploy.js                     # Deployment script
│   ├── verify.js                     # Verification script
│   └── interact.js                   # Interaction script
├── test/                             # Test files (to be added)
├── hardhat.config.js                 # Hardhat configuration
├── package.json                       # Dependencies
└── .env                              # Environment variables (not in git)
```

## 🔧 Available Scripts

### Compile

```bash
npm run compile
```

Compiles all contracts in the `contracts/` directory.

### Deploy

**Testnet:**
```bash
npm run deploy:testnet
```

**Mainnet:**
```bash
npm run deploy:mainnet
```

### Verify

**Testnet:**
```bash
npm run verify:testnet <CONTRACT_ADDRESS>
```

**Mainnet:**
```bash
npm run verify:mainnet <CONTRACT_ADDRESS>
```

### Test

```bash
npm run test
```

### Clean

```bash
npm run clean
```

Removes cache and artifacts.

## 🌐 Networks

### Conflux eSpace Testnet
- **RPC URL:** `https://evmtestnet.confluxrpc.com`
- **Chain ID:** `71`
- **Explorer:** `https://evmtestnet.confluxscan.net`
- **Faucet:** `https://faucet.confluxnetwork.org/`

### Conflux eSpace Mainnet
- **RPC URL:** `https://evm.confluxrpc.com`
- **Chain ID:** `1030`
- **Explorer:** `https://evm.confluxscan.net`

## 📝 Deployment Process

1. **Get Testnet CFX:**
   - Visit [Conflux Faucet](https://faucet.confluxnetwork.org/)
   - Request testnet CFX for your deployment address

2. **Set Private Key:**
   - Export private key from MetaMask or your wallet
   - Add to `.env` file as `PRIVATE_KEY`

3. **Deploy:**
   ```bash
   npm run deploy:testnet
   ```

4. **Save Contract Address:**
   - Copy the deployed contract address
   - Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `frontend/.env`

5. **Verify (Optional):**
   ```bash
   npx hardhat verify --network confluxTestnet <CONTRACT_ADDRESS>
   ```

## 🔍 Interacting with Contract

Use the `interact.js` script to interact with deployed contracts:

### Add a Payee (Owner Only)

```bash
CONTRACT_ADDRESS=0x... \
ADD_PAYEE_ADDRESS=0x... \
ADD_PAYEE_SHARES=100 \
npx hardhat run scripts/interact.js --network confluxTestnet
```

### Deposit CFX

```bash
CONTRACT_ADDRESS=0x... \
DEPOSIT_AMOUNT=1.0 \
npx hardhat run scripts/interact.js --network confluxTestnet
```

### Check Pending Payment

```bash
CONTRACT_ADDRESS=0x... \
CHECK_PENDING_ADDRESS=0x... \
npx hardhat run scripts/interact.js --network confluxTestnet
```

## 🧪 Testing

Create test files in the `test/` directory. Example:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfluxPaymentSplitter", function () {
  it("Should deploy and set owner", async function () {
    const [owner] = await ethers.getSigners();
    const Splitter = await ethers.getContractFactory("ConfluxPaymentSplitter");
    const splitter = await Splitter.deploy();
    
    expect(await splitter.owner()).to.equal(owner.address);
  });
});
```

Run tests:

```bash
npm run test
```

## 🔐 Security Notes

- ⚠️ **Never commit your `.env` file**
- ⚠️ **Never share your private key**
- ⚠️ **Use a separate account for testing**
- ⚠️ **Double-check network before deploying to mainnet**

## 📚 Contract Details

- **Solidity Version:** 0.8.19
- **Optimizer:** Enabled (200 runs)
- **License:** MIT

### Contract Functions

- `addPayee(address, uint256)` - Add a payee with shares (owner only)
- `deposit()` - Deposit CFX to the contract
- `release(address)` - Release payment to a payee
- `pending(address)` - Check pending payment for an address
- `shares(address)` - Get shares for an address
- `totalShares()` - Get total shares
- `owner()` - Get contract owner

## 🐛 Troubleshooting

### "Insufficient funds"
- Make sure you have enough CFX for gas fees
- Get testnet CFX from the faucet

### "Network not found"
- Check `hardhat.config.js` network configuration
- Verify RPC URL is correct

### "Contract verification failed"
- Make sure contract is deployed
- Check constructor arguments match
- Verify you're using the correct network

### "Private key not found"
- Check `.env` file exists
- Verify `PRIVATE_KEY` is set correctly
- Make sure there are no extra spaces or quotes

## 📖 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Conflux Documentation](https://developers.confluxnetwork.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [ConfluxScan Explorer](https://evmtestnet.confluxscan.net)

## 📄 License

MIT

