const fs = require("fs");
const path = require("path");

/**
 * Script to copy the compiled ABI from Hardhat artifacts to frontend
 * Run this after compiling the contract: npm run compile && node scripts/copy-abi.js
 */

async function main() {
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ConfluxPaymentSplitter.sol/ConfluxPaymentSplitter.json");
  const frontendAbiPath = path.join(__dirname, "../../frontend/contracts/abi.json");

  // Check if artifact exists
  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Error: Contract artifact not found!");
    console.log("Please compile the contract first:");
    console.log("  npm run compile");
    process.exit(1);
  }

  // Read artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // Ensure frontend contracts directory exists
  const frontendContractsDir = path.dirname(frontendAbiPath);
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Write ABI to frontend
  fs.writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));

  console.log("✅ ABI copied successfully!");
  console.log(`   From: ${artifactPath}`);
  console.log(`   To: ${frontendAbiPath}`);
  console.log(`   Functions: ${abi.filter(item => item.type === "function").length}`);
  console.log(`   Events: ${abi.filter(item => item.type === "event").length}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error copying ABI:", error);
    process.exit(1);
  });

