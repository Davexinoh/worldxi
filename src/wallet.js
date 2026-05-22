import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID, RPC_URL, ABI } from "./contract.js";

const XLAYER_TESTNET = {
  chainId:         `0x${CHAIN_ID.toString(16)}`, // 0x7A0
  chainName:       "X Layer Testnet",
  nativeCurrency:  { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls:         ["https://testrpc.xlayer.tech"],
  blockExplorerUrls: ["https://xlayer-testnet.blockscout.com"],
};

/* ── Check OKX Wallet is installed ── */
export const isOKXWalletInstalled = () => {
  return typeof window !== "undefined" && !!window.okxwallet;
};

/* ── Switch or add X Layer Testnet ── */
export const switchToXLayer = async () => {
  const provider = window.okxwallet;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: XLAYER_TESTNET.chainId }],
    });
  } catch (err) {
    // Chain not added yet — add it
    if (err.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [XLAYER_TESTNET],
      });
    } else {
      throw err;
    }
  }
};

/* ── Connect OKX Wallet ── */
export const connectWallet = async () => {
  if (!isOKXWalletInstalled()) {
    throw new Error("OKX Wallet not installed. Please install it from okx.com/web3");
  }

  // Request accounts
  const accounts = await window.okxwallet.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned");
  }

  // Switch to X Layer testnet
  await switchToXLayer();

  return accounts[0].toLowerCase();
};

/* ── Get ethers signer via OKX Wallet ── */
export const getSigner = async () => {
  const web3Provider = new ethers.BrowserProvider(window.okxwallet);
  return web3Provider.getSigner();
};

/* ── Get read-only contract ── */
export const getReadContract = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId: CHAIN_ID,
    name: "xlayer-testnet",
  });
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

/* ── Get write contract (needs signer) ── */
export const getWriteContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

/* ── Check if wallet has registered a username ── */
export const getExistingUsername = async (walletAddress) => {
  try {
    const contract = getReadContract();
    const result = await contract.getManager(walletAddress);
    // result: [username, registeredAt, total, exists]
    if (result[3] === true) {
      return result[0]; // username
    }
    return null;
  } catch {
    return null;
  }
};

/* ── Register manager username onchain ── */
export const registerManagerOnchain = async (username) => {
  const contract = await getWriteContract();
  const tx = await contract.registerManager(username);
  await tx.wait();
  return tx.hash;
};

/* ── Check username availability onchain ── */
export const checkUsernameAvailable = async (username) => {
  try {
    const contract = getReadContract();
    return await contract.isUsernameAvailable(username);
  } catch {
    return true; // optimistic fallback
  }
};

/* ── Submit squad onchain ── */
export const submitSquadOnchain = async (matchday, playerIds) => {
  // Generate a deterministic hash of the squad
  const squadString = [...playerIds].sort().join(",");
  const squadHash = ethers.keccak256(ethers.toUtf8Bytes(squadString));

  const contract = await getWriteContract();
  const tx = await contract.submitSquad(matchday, squadHash);
  await tx.wait();
  return { txHash: tx.hash, squadHash };
};
