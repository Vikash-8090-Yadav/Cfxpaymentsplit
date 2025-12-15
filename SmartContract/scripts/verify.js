const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in environment variables");
    console.log("Usage: CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network confluxTestnet");
    process.exit(1);
  }

  console.log("🔍 Verifying contract at:", contractAddress);
  console.log("🌐 Network:", hre.network.name, "\n");

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor arguments
    });
    console.log("\n✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️  Contract is already verified");
    } else {
      console.error("❌ Verification failed:", error.message);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

