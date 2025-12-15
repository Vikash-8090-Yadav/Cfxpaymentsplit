const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in environment variables");
    console.log("Usage: CONTRACT_ADDRESS=0x... npx hardhat run scripts/interact.js --network confluxTestnet");
    process.exit(1);
  }

  console.log("🔗 Connecting to contract at:", contractAddress);
  console.log("🌐 Network:", hre.network.name, "\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", signer.address, "\n");

  const ConfluxPaymentSplitter = await hre.ethers.getContractFactory("ConfluxPaymentSplitter");
  const contract = ConfluxPaymentSplitter.attach(contractAddress);

  // Get contract info
  console.log("📊 Contract Information:");
  const owner = await contract.owner();
  const totalShares = await contract.totalShares();
  const totalReleased = await contract.totalReleased();
  const balance = await hre.ethers.provider.getBalance(contractAddress);

  console.log("  Owner:", owner);
  console.log("  Total Shares:", totalShares.toString());
  console.log("  Total Released:", hre.ethers.formatEther(totalReleased), "CFX");
  console.log("  Contract Balance:", hre.ethers.formatEther(balance), "CFX\n");

  // Check if signer is owner
  const isOwner = owner.toLowerCase() === signer.address.toLowerCase();
  console.log("🔐 Is deployer the owner?", isOwner ? "✅ Yes" : "❌ No\n");

  // Example: Add a payee (only if owner)
  if (isOwner && process.env.ADD_PAYEE_ADDRESS && process.env.ADD_PAYEE_SHARES) {
    console.log("➕ Adding payee...");
    try {
      const tx = await contract.addPayee(process.env.ADD_PAYEE_ADDRESS, process.env.ADD_PAYEE_SHARES);
      await tx.wait();
      console.log("✅ Payee added successfully!\n");
    } catch (error) {
      console.error("❌ Failed to add payee:", error.message, "\n");
    }
  }

  // Example: Deposit (if amount specified)
  if (process.env.DEPOSIT_AMOUNT) {
    console.log("💰 Depositing CFX...");
    try {
      const amount = hre.ethers.parseEther(process.env.DEPOSIT_AMOUNT);
      const tx = await contract.deposit({ value: amount });
      await tx.wait();
      console.log(`✅ Deposited ${process.env.DEPOSIT_AMOUNT} CFX successfully!\n`);
    } catch (error) {
      console.error("❌ Failed to deposit:", error.message, "\n");
    }
  }

  // Example: Check pending for an address
  if (process.env.CHECK_PENDING_ADDRESS) {
    console.log("🔍 Checking pending payment...");
    try {
      const pending = await contract.pending(process.env.CHECK_PENDING_ADDRESS);
      console.log(`  Address: ${process.env.CHECK_PENDING_ADDRESS}`);
      console.log(`  Pending: ${hre.ethers.formatEther(pending)} CFX\n`);
    } catch (error) {
      console.error("❌ Failed to check pending:", error.message, "\n");
    }
  }

  console.log("💡 Usage examples:");
  console.log("  Add payee: ADD_PAYEE_ADDRESS=0x... ADD_PAYEE_SHARES=100 npx hardhat run scripts/interact.js --network confluxTestnet");
  console.log("  Deposit: DEPOSIT_AMOUNT=1.0 npx hardhat run scripts/interact.js --network confluxTestnet");
  console.log("  Check pending: CHECK_PENDING_ADDRESS=0x... npx hardhat run scripts/interact.js --network confluxTestnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

