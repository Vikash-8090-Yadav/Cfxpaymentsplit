const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ConfluxPaymentSplitter...\n");

  // Check if PRIVATE_KEY is set
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Error: PRIVATE_KEY not found in environment variables");
    console.log("\n📋 Please follow these steps:");
    console.log("1. Copy env.example to .env:");
    console.log("   cp env.example .env");
    console.log("2. Edit .env and add your private key:");
    console.log("   PRIVATE_KEY=your_private_key_here");
    console.log("\n⚠️  WARNING: Never share your private key!");
    process.exit(1);
  }

  // Get the deployer account
  const signers = await hre.ethers.getSigners();
  
  if (!signers || signers.length === 0) {
    console.error("❌ Error: No signers available");
    console.log("Please check your PRIVATE_KEY in .env file");
    process.exit(1);
  }

  const deployer = signers[0];
  
  if (!deployer || !deployer.address) {
    console.error("❌ Error: Could not get deployer address");
    console.log("Please verify your PRIVATE_KEY is correct in .env file");
    process.exit(1);
  }

  console.log("📝 Deploying from account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CFX\n");

  // Get the contract factory
  const ConfluxPaymentSplitter = await hre.ethers.getContractFactory("ConfluxPaymentSplitter");

  // Deploy the contract with gas price handling
  console.log("⏳ Deploying contract...");
  
  // Try to get current gas price from network
  let gasPrice;
  try {
    const feeData = await hre.ethers.provider.getFeeData();
    gasPrice = feeData.gasPrice;
    if (gasPrice) {
      // Add 20% buffer to gas price
      gasPrice = gasPrice * 120n / 100n;
      console.log(`⛽ Using gas price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);
    }
  } catch (error) {
    console.log("⚠️  Could not fetch gas price, using default");
  }

  const deployOptions = gasPrice ? { gasPrice } : {};
  const splitter = await ConfluxPaymentSplitter.deploy(deployOptions);
  
  // Wait for deployment
  await splitter.waitForDeployment();
  const contractAddress = await splitter.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("👤 Owner:", deployer.address);
  console.log("\n📋 Next steps:");
  console.log("1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in frontend/.env");
  console.log("2. Verify contract on ConfluxScan:");
  console.log(`   npx hardhat verify --network confluxTestnet ${contractAddress}`);
  console.log("\n💡 Save this information:");
  console.log(`   Contract: ${contractAddress}`);
  console.log(`   Owner: ${deployer.address}`);
  console.log(`   Network: ${hre.network.name}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    owner: deployer.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "../deployments");
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

