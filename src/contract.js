// WorldXI Contract — X Layer Testnet
export const CONTRACT_ADDRESS = "0x7D96E5e3D8a188ce5472785BD442cdE7e12F3dF4";
export const CHAIN_ID = 1952;
export const RPC_URL = "https://testrpc.xlayer.tech";

export const ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "newAdmin", "type": "address" }],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
    "name": "registerManager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "internalType": "string", "name": "squadHash", "type": "string" }
    ],
    "name": "submitSquad",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "manager", "type": "address" },
      { "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "internalType": "uint16", "name": "pts", "type": "uint16" }
    ],
    "name": "recordPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "managers_", "type": "address[]" },
      { "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "internalType": "uint16[]", "name": "pts", "type": "uint16[]" }
    ],
    "name": "recordPointsBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "wallet", "type": "address" }],
    "name": "getManager",
    "outputs": [
      { "internalType": "string", "name": "username", "type": "string" },
      { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
      { "internalType": "uint256", "name": "total", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "uint8", "name": "matchday", "type": "uint8" }
    ],
    "name": "getSquad",
    "outputs": [
      { "internalType": "string", "name": "squadHash", "type": "string" },
      { "internalType": "uint256", "name": "submittedAt", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "uint8", "name": "matchday", "type": "uint8" }
    ],
    "name": "getPoints",
    "outputs": [
      { "internalType": "uint16", "name": "pts", "type": "uint16" },
      { "internalType": "uint256", "name": "recordedAt", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getManagerCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
    "name": "isUsernameAvailable",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "totalPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint8", "name": "", "type": "uint8" }
    ],
    "name": "squads",
    "outputs": [
      { "internalType": "string", "name": "squadHash", "type": "string" },
      { "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "internalType": "uint256", "name": "submittedAt", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ManagerRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "squadHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "SquadSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "matchday", "type": "uint8" },
      { "indexed": false, "internalType": "uint16", "name": "points", "type": "uint16" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PointsRecorded",
    "type": "event"
  }
];
