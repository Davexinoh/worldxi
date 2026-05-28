```markdown
# W⚽RLDXI — Onchain Fantasy Football for World Cup 2026

> Pick your squad. Lock it onchain. Glory awaits June 11.

**Live App:** https://worldxi.onrender.com
**Network:** X Layer Testnet — Chain ID 195
**Contract:** `0x7D96E5e3D8a188ce5472785BD442cdE7e12F3dF4`
**Explorer:** https://www.okx.com/explorer/xlayer-test/address/0x7D96E5e3D8a188ce5472785BD442cdE7e12F3dF4

---

## The Problem

Fantasy football has always been controlled by centralized platforms — they own your squad, your points, your history. If they go down, your data disappears. If they change the rules, you have no say.

WorldXI changes that. Every squad selection is hashed and written permanently to X Layer. No central server owns your picks. The blockchain is the referee.

---

## What is WorldXI?

WorldXI is a **free-to-play onchain fantasy football game** built natively for the FIFA World Cup 2026. It runs entirely on X Layer — OKX's EVM-compatible Layer 2 chain.

Players connect their OKX Wallet, build a 15-man squad from real World Cup 2026 national squads, stay within a 100 OKB budget, pick a captain and vice-captain, then lock their squad permanently onchain before the June 11 kickoff deadline.

When the tournament starts, points are calculated from real match results and recorded onchain by the admin wallet. The leaderboard updates after every matchday. Transfers open between matchdays so managers can respond to injuries, form, and results.

**The app is live and accepting squads right now. The game begins June 11, 2026.**

---

## Core Features

### Squad Builder
- 15-man squad from 9 nations: France, England, Brazil, Germany, Portugal, Spain, Argentina, Belgium, Netherlands
more nations will be added has some squads have not been confirmed yet
- Real World Cup 2026 player data with FPL-inspired pricing
- 100 OKB total budget — spend wisely
- Formation selector: 4-3-3, 3-5-2, 5-2-3, 4-2-4, 3-4-3
- Position limits: 2 GK, 5 DEF, 5 MID, 3 FWD
- Max 3 players per nation
- Drag-and-drop pitch view with bench

### Captaincy System
- Captain earns **2× points** every matchday
- Vice-captain takes over if captain doesn't play
- Country bonus: **+10%** if 3 or more players from the same nation start your XI

### Onchain Squad Locking
- Squad is hashed client-side using keccak256 of sorted player IDs
- Hash submitted to X Layer via `submitSquad(matchday, squadHash)`
- Manager registered onchain via `registerManager(username)`
- Transaction hash shown with direct Blockscout link
- Locked squads cannot be modified — immutable on X Layer

### Session Persistence
- Full progress saved to localStorage keyed by wallet address
- Reload, disconnect, reconnect — everything restores exactly where you left it
- Multiple wallet addresses supported independently

### OKX Wallet Native
- Built exclusively for OKX Wallet
- Auto-switches to X Layer Testnet on connect
- Handles chain addition if not already configured
- Works on desktop browser

---

## Scoring System (Activates June 11)

| Action | Points |
|---|---|
| Goal scored (FWD/MID) | +5 |
| Goal scored (DEF/GK) | +6 |
| Assist | +3 |
| Clean sheet (GK/DEF) | +4 |
| Clean sheet (MID) | +1 |
| Yellow card | -1 |
| Red card | -3 |
| Captain bonus | ×2 all points |
| Country bonus (3+ same nation) | +10% total |

Points recorded onchain after each matchday by admin wallet using `recordPoints` or `recordPointsBatch`.

---

## Why "Coming Soon" on Leaderboard and Transfers?

**Because the World Cup hasn't started yet.**

The leaderboard requires real match data to calculate points — that data doesn't exist until June 11 when the tournament begins. Showing a fake or empty leaderboard would be misleading.

Transfers open between matchdays for the same reason — there are no matchdays yet.

This is intentional product design, not an incomplete feature. The infrastructure is fully built and ready. The switch flips on June 11.

---

## Onchain Architecture

```
User Wallet (OKX)
      │
      ▼
worldxi.onrender.com (React + Vite)
      │
      ├── registerManager(username)  ──────────────┐
      │                                             │
      └── submitSquad(matchday, squadHash)  ────────┤
                                                    │
                                          WorldXI.sol on X Layer
                                          0x7D96E5e3...F3dF4
                                                    │
                                          recordPoints() ── Admin only
                                          (post-matchday scoring)
```

| Action | Contract Function | Caller | Timing |
|---|---|---|---|
| Register manager name | `registerManager(username)` | User wallet | On squad lock |
| Submit squad hash | `submitSquad(matchday, hash)` | User wallet | On squad lock |
| Record matchday points | `recordPoints(manager, matchday, pts)` | Admin wallet | After each match |
| Batch record points | `recordPointsBatch(managers[], matchday, pts[])` | Admin wallet | After each match |

### Squad Integrity Verification
Anyone can verify a squad by:
1. Taking the player ID array
2. Sorting it alphabetically
3. Joining with commas
4. Computing keccak256
5. Comparing with the hash stored onchain

No trust required. The math is the referee.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Inline styles with glassmorphism design system |
| Wallet | OKX Wallet via ethers.js v6 |
| Blockchain | X Layer Testnet (EVM, Chain ID 195) |
| Smart Contract | Solidity ^0.8.20 |
| RPC | https://testrpc.xlayer.tech |
| Deployment | Render (static site, auto-deploy from GitHub) |
| Player Data | Real World Cup 2026 squads, ~230 players across 9 nations |

---

## Smart Contract

**Address:** `0x7D96E5e3D8a188ce5472785BD442cdE7e12F3dF4`
**Network:** X Layer Testnet
**Language:** Solidity ^0.8.20
**License:** MIT

### Key Functions

```solidity
// Register a manager — one time per wallet
function registerManager(string calldata username) external

// Submit squad for a matchday — hashed selection
function submitSquad(uint8 matchday, string calldata squadHash) external onlyRegistered

// Record points after matchday — admin only
function recordPoints(address manager, uint8 matchday, uint16 pts) external onlyAdmin

// Batch record for all managers — gas efficient
function recordPointsBatch(address[] calldata managers_, uint8 matchday, uint16[] calldata pts) external onlyAdmin

// Read manager data
function getManager(address wallet) external view returns (string, uint256, uint256, bool)

// Read squad submission
function getSquad(address wallet, uint8 matchday) external view returns (string, uint256, bool)
```

### Events Emitted
- `ManagerRegistered(wallet, username, timestamp)`
- `SquadSubmitted(wallet, matchday, squadHash, timestamp)`
- `PointsRecorded(wallet, matchday, points, timestamp)`

---

## Local Development

```bash
# Clone
git clone https://github.com/Davexinoh/worldxi
cd worldxi

# Install
npm install

# Configure
cp .env.example .env
# No changes needed for testnet — defaults work

# Run
npm run dev
```

**Requirements:**
- OKX Wallet browser extension installed
- X Layer Testnet will be added automatically on first connect
- No gas needed — testnet OKB is free

---

## Project Structure

```
worldxi/
├── src/
│   ├── App.jsx              # Main app, routing, session management
│   ├── SquadBuilder.jsx     # Squad builder UI + onchain lock
│   ├── PlayerPickerModal.jsx # Player search and selection
│   ├── Pitch.jsx            # Visual pitch with formation
│   ├── CaptainSelector.jsx  # Captain and vice-captain picker
│   ├── players.js           # Full World Cup 2026 player dataset
│   ├── wallet.js            # OKX Wallet + X Layer integration
│   └── contract.js          # ABI + contract address
├── contract/
│   └── WorldXI.sol          # Smart contract source
├── public/
│   ├── waka-waka.mp3        # Waka Waka intro audio
│   └── *.mp4                # Video splash
├── .env.example
└── README.md
```

---

## Hackathon Submission — OKX X Cup

### X Layer Integration Evidence
- ✅ Smart contract deployed to X Layer Testnet
- ✅ Real user transactions confirmed onchain
- ✅ OKX Wallet as the exclusive wallet integration
- ✅ Chain auto-switch to X Layer on connect
- ✅ Squad hashes permanently stored on X Layer
- ✅ Manager registration written onchain
- ✅ All transactions verifiable on OKX Explorer

### What Makes WorldXI Different
- **Not a demo** — real users have already locked squads onchain
- **Not custodial** — no backend, no database, no middleman
- **Not fake** — real World Cup 2026 players, real prices, real scoring rules
- **Built for the moment** — World Cup 2026 is the biggest sporting event on the planet. WorldXI is ready for it.

---

## Roadmap Post-Hackathon

- [ ] Mainnet deployment on X Layer mainnet
- [ ] Live scoring via football data API → onchain recording
- [ ] Leaderboard with onchain reads (activates June 11)
- [ ] Transfer window between matchdays
- [ ] Prize pool integration using OKB
- [ ] Mobile-native OKX Wallet deep link support

---

## Builder

**Davexinoh** — [@dontfadedave](https://x.com/dontfadedave) on X
---

*WorldXI — Because your squad deserves to exist forever.*
```
