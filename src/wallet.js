import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID, RPC_URL, ABI } from "./contract.js";

const XLAYER_TESTNET = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: "X Layer Testnet",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: ["https://xlayertestrpc.okx.com"],
  blockExplorerUrls: ["https://xlayer-testnet.blockscout.com"],
};

const getInjectedProvider = () => {
  if (typeof window === "undefined") throw new Error("Browser environment unavailable");
  const provider = window.okxwallet?.ethereum || window.ethereum;
  if (!provider) throw new Error("No EVM wallet detected. Open inside OKX Wallet or install extension.");
  return provider;
};

export const isOKXWalletInstalled = () => {
  if (typeof window === "undefined") return false;
  return !!(window.okxwallet?.ethereum || window.ethereum);
};

const silentSwitchToXLayer = async () => {
  try {
    const provider = getInjectedProvider();
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: XLAYER_TESTNET.chainId }],
    });
  } catch (err) {
    if (err.code === 4902) {
      try {
        const provider = getInjectedProvider();
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [XLAYER_TESTNET],
        });
      } catch (_) {}
    }
  }
};

export const switchToXLayer = silentSwitchToXLayer;

export const connectWallet = async () => {
  try {
    const provider = getInjectedProvider();
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) throw new Error("No wallet accounts found");
    await silentSwitchToXLayer();
    return accounts[0].toLowerCase();
  } catch (err) {
    throw new Error(err?.message || "Wallet connection failed");
  }
};

export const getBrowserProvider = () => {
  return new ethers.BrowserProvider(getInjectedProvider(), "any");
};

export const getSigner = async () => {
  const provider = getBrowserProvider();
  return await provider.getSigner();
};

const getRpcProvider = () => new ethers.JsonRpcProvider(RPC_URL);

export const getReadContract = () => {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, getRpcProvider());
};

export const getWriteContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const getExistingUsername = async (walletAddress) => {
  try {
    const contract = getReadContract();
    const result = await contract.getManager(walletAddress);
    if (result?.[3] === true) return result[0];
    return null;
  } catch (err) {
    console.error("Failed to fetch existing username:", err);
    return null;
  }
};

export const checkUsernameAvailable = async (username) => {
  try {
    const contract = getReadContract();
    return await contract.isUsernameAvailable(username);
  } catch (err) {
    console.error("Username availability check failed:", err);
    return false;
  }
};

export const registerManagerOnchain = async (username) => {
  try {
    await silentSwitchToXLayer();
    const signer = await getSigner();
    const address = await signer.getAddress();
    const readContract = getReadContract();
    const existing = await readContract.getManager(address);

    if (existing[3] === true) {
      console.log("Already registered onchain as:", existing[0]);
      return "already-registered";
    }

    const contract = await getWriteContract();
    const tx = await contract.registerManager(username);
    console.log("Register manager tx:", tx.hash);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Manager registration failed:", err);
    if (err.code === 4001) throw new Error("Transaction rejected by user");
    if (
      err?.reason === "AlreadyRegistered" ||
      err?.message?.includes("AlreadyRegistered")
    ) return "already-registered";
    throw new Error(
      err?.reason || err?.shortMessage || err?.message || "Registration failed"
    );
  }
};

export const submitSquadOnchain = async (matchday, playerIds) => {
  try {
    // Step 1 — ensure registered onchain
    const provider = getInjectedProvider();
    const accounts = await provider.request({ method: "eth_accounts" });
    const address = accounts[0]?.toLowerCase();

    if (address) {
      const readContract = getReadContract();
      const existing = await readContract.getManager(address);

      if (!existing[3]) {
        // Not registered — auto-register with localStorage username
        const username =
          localStorage.getItem(`worldxi_username_${address}`) ||
          localStorage.getItem("worldxi_username");

        if (!username) throw new Error("No username found. Please set a manager name first.");

        await silentSwitchToXLayer();
        const writeContract = await getWriteContract();
        const regTx = await writeContract.registerManager(username);
        console.log("Auto-registering manager:", regTx.hash);
        await regTx.wait();
        console.log("Manager registered onchain.");
      }

      // Step 2 — check if squad already submitted
      const existingSquad = await readContract.getSquad(address, matchday);
      if (existingSquad[2] === true) {
        console.log("Squad already submitted for matchday", matchday);
        return { txHash: "already-submitted", squadHash: existingSquad[0] };
      }
    }

    // Step 3 — submit squad
    const squadString = [...playerIds].sort().join(",");
    const squadHash = ethers.keccak256(ethers.toUtf8Bytes(squadString));

    await silentSwitchToXLayer();
    const contract = await getWriteContract();
    const tx = await contract.submitSquad(matchday, squadHash);
    console.log("Squad tx:", tx.hash);
    await tx.wait();
    return { txHash: tx.hash, squadHash };
  } catch (err) {
    console.error("Squad submission failed:", err);
    if (err.code === 4001) throw new Error("Transaction rejected by user");
    if (
      err?.reason === "SquadAlreadySubmitted" ||
      err?.message?.includes("SquadAlreadySubmitted")
    ) return { txHash: "already-submitted", squadHash: "" };
    throw new Error(
      err?.reason || err?.shortMessage || err?.message || "Squad submission failed"
    );
  }
};

export const debugWalletEnvironment = async () => {
  try {
    const provider = getInjectedProvider();
    const browserProvider = new ethers.BrowserProvider(provider, "any");
    const network = await browserProvider.getNetwork();
    const blockNumber = await browserProvider.getBlockNumber();
    console.log("Network:", network);
    console.log("Block:", blockNumber);
    return { network, blockNumber };
  } catch (err) {
    console.error("Wallet debug failed:", err);
    return null;
  }
};
