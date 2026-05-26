import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID, RPC_URL, ABI } from "./contract.js";

const XLAYER_TESTNET = {
  chainId:         `0x${CHAIN_ID.toString(16)}`,
  chainName:       "X Layer Testnet",
  nativeCurrency:  { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls:         ["https://testrpc.xlayer.tech"],
  blockExplorerUrls: ["https://xlayer-testnet.blockscout.com"],
};

export const isOKXWalletInstalled = () => {
  return typeof window !== "undefined" && !!window.okxwallet;
};

export const switchToXLayer = async () => {
  const provider = window.okxwallet;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: XLAYER_TESTNET.chainId }],
    });
  } catch (err) {
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

export const connectWallet = async () => {
  if (!isOKXWalletInstalled()) {
    throw new Error("OKX Wallet not installed. Please add okx wallet extension");
  }

  const accounts = await window.okxwallet.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned");
  }

  await switchToXLayer();

  return accounts[0].toLowerCase();
};

export const getSigner = async () => {
  const web3Provider = new ethers.BrowserProvider(window.okxwallet);
  return web3Provider.getSigner();
};

export const getReadContract = () => {
  const web3Provider = new ethers.BrowserProvider(window.okxwallet);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, web3Provider);
};

export const getWriteContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const getExistingUsername = async (walletAddress) => {
  try {
    const contract = getReadContract();
    const result = await contract.getManager(walletAddress);
    if (result[3] === true) {
      return result[0];
    }
    return null;
  } catch {
    return null;
  }
};

export const registerManagerOnchain = async (username) => {
  const contract = await getWriteContract();
  const tx = await contract.registerManager(username);
  await tx.wait();
  return tx.hash;
};

export const checkUsernameAvailable = async (username) => {
  try {
    const contract = getReadContract();
    return await contract.isUsernameAvailable(username);
  } catch {
    return true;
  }
};

export const submitSquadOnchain = async (matchday, playerIds) => {
  const squadString = [...playerIds].sort().join(",");
  const squadHash = ethers.keccak256(ethers.toUtf8Bytes(squadString));

  const contract = await getWriteContract();
  const tx = await contract.submitSquad(matchday, squadHash);
  await tx.wait();
  return { txHash: tx.hash, squadHash };
};
