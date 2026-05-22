const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ── CONFIG ──────────────────────────────────────────────────
const RPC_URL    = "https://testrpc.xlayer.tech";
const CHAIN_ID   = 195;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // never hardcode

// ── ABI + BYTECODE ───────────────────────────────────────────
// Run: npx solc --abi --bin WorldXI.sol -o ./out
// Then paste the output below, or use hardhat/foundry
const artifact = JSON.parse(
  fs.readFileSync(path.join(__dirname, "out", "WorldXI.json"), "utf8")
);

async function main() {
  if (!PRIVATE_KEY) {
    console.error("Set PRIVATE_KEY in your environment");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId: CHAIN_ID,
    name:    "xlayer-testnet",
  });

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Deploying from:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "OKB");

  if (balance === 0n) {
    console.error("No testnet OKB. Get some from the X Layer faucet.");
    process.exit(1);
  }

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log("Deploying WorldXI...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✓ WorldXI deployed at:", address);
  console.log("Explorer:", `https://xlayer-testnet.scan.com/address/${address}`);

  // Save address for frontend
  fs.writeFileSync(
    path.join(__dirname, "contract-address.json"),
    JSON.stringify({ address, chainId: CHAIN_ID, network: "xlayer-testnet" }, null, 2)
  );

  console.log("✓ Address saved to contract-address.json");
}

main().catch(console.error);
