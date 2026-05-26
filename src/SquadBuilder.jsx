import { useState } from "react";
import { NATIONS, getAllPlayers } from "./players.js";
import PlayerPickerModal from "./PlayerPickerModal.jsx";
import Pitch from "./Pitch.jsx";
import CaptainSelector from "./CaptainSelector.jsx";

const FORMATIONS = [
  { name: "4-3-3", gk: 1, def: 4, mid: 3, fwd: 3 },
  { name: "3-5-2", gk: 1, def: 3, mid: 5, fwd: 2 },
  { name: "5-2-3", gk: 1, def: 5, mid: 2, fwd: 3 },
  { name: "4-2-4", gk: 1, def: 4, mid: 2, fwd: 4 },
  { name: "3-4-3", gk: 1, def: 3, mid: 4, fwd: 3 },
];

const BUDGET_TOTAL = 100;

export default function SquadBuilder({ squad, setSquad }) {
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [formation, setFormation] = useState(FORMATIONS[0]);

  // Budget calculation
  const budgetSpent = squad.selectedPlayerIds.reduce((sum, playerId) => {
    const player = findPlayerById(playerId);
    return sum + (player ? player.price : 0);
  }, 0);
  const budgetRemaining = BUDGET_TOTAL - budgetSpent;

  // Find player by ID
  function findPlayerById(id) {
    for (const nation of Object.values(NATIONS)) {
      const player = nation.find(p => p.id === id);
      if (player) return player;
    }
    return null;
  }

  // Add player
  function handleAddPlayer(playerId) {
    if (squad.selectedPlayerIds.includes(playerId)) return;
    
    const player = findPlayerById(playerId);
    if (!player) return;
    if (budgetRemaining < player.price) return;

    // Full squad position limits
const POSITION_LIMITS = {
  GK: 2,
  DEF: 5,
  MID: 5,
  FWD: 3,
};

const posCount = squad.selectedPlayerIds.filter(id => {
  const p = findPlayerById(id);
  return p && p.pos === player.pos;
}).length;

if (posCount >= POSITION_LIMITS[player.pos]) return;

    // Nation limit (max 3)
    const nationCount = squad.selectedPlayerIds.filter(id => {
      const p = findPlayerById(id);
      return p && p.nation === player.nation;
    }).length;
    if (nationCount >= 3) return;

    setSquad(prev => ({
      ...prev,
      selectedPlayerIds: [...prev.selectedPlayerIds, playerId]
    }));
  }

  // Remove player
  function handleRemovePlayer(playerId) {
    setSquad(prev => ({
      ...prev,
      selectedPlayerIds: prev.selectedPlayerIds.filter(id => id !== playerId),
      captain: prev.captain === playerId ? null : prev.captain,
      viceCaptain: prev.viceCaptain === playerId ? null : prev.viceCaptain,
    }));
  }

  // Swap players on pitch
  function handleSwapPlayers(playerId1, playerId2) {
    const ids = [...squad.selectedPlayerIds];
    const idx1 = ids.indexOf(playerId1);
    const idx2 = ids.indexOf(playerId2);
    if (idx1 >= 0 && idx2 >= 0) {
      [ids[idx1], ids[idx2]] = [ids[idx2], ids[idx1]];
      setSquad(prev => ({ ...prev, selectedPlayerIds: ids }));
    }
  }

  const isSquadComplete = squad.selectedPlayerIds.length === 15;
  const canLockSquad = isSquadComplete && squad.captain && squad.viceCaptain;

  return (
    <div style={{ padding: "16px", background: "var(--bg)", minHeight: "100vh" }}>
      {/* Formation Selector */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", color: "var(--grey2)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: 1 }}>
          Formation
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {FORMATIONS.map(f => (
            <button
              key={f.name}
              onClick={() => setFormation(f)}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: formation.name === f.name ? "2px solid var(--accent)" : "1px solid var(--grey2)",
                background: formation.name === f.name ? "rgba(0,232,122,0.1)" : "transparent",
                color: formation.name === f.name ? "var(--accent)" : "var(--grey)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Bar */}
      <div style={{ marginBottom: "20px", padding: "12px", borderRadius: "8px", background: "rgba(0,232,122,0.05)", border: "1px solid rgba(0,232,122,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px" }}>
          <span style={{ color: "var(--grey)" }}>Budget Used</span>
          <span style={{ color: budgetRemaining < 10 ? "var(--red)" : "var(--accent)", fontWeight: 600 }}>
            {budgetSpent.toFixed(1)} / {BUDGET_TOTAL} OKB
          </span>
        </div>
        <div style={{ width: "100%", height: "6px", background: "var(--grey2)", borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(budgetSpent / BUDGET_TOTAL) * 100}%`,
              background: budgetRemaining < 10 ? "var(--red)" : "var(--accent)",
              transition: "width 0.2s ease",
            }}
          />
        </div>
        <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--grey)", textAlign: "right" }}>
          {budgetRemaining.toFixed(1)} OKB remaining
        </div>
      </div>

      {/* Squad Counter */}
      <div style={{ marginBottom: "20px", fontSize: "14px", color: "var(--grey)", textAlign: "center" }}>
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>{squad.selectedPlayerIds.length}</span>/15 Players
      </div>

      {/* Pitch */}
      <Pitch
        selectedPlayerIds={squad.selectedPlayerIds}
        formation={formation}
        findPlayerById={findPlayerById}
        onSwap={handleSwapPlayers}
        onRemove={handleRemovePlayer}
        captain={squad.captain}
        viceCaptain={squad.viceCaptain}
      />

      {/* Add Players Button */}
      {!isSquadComplete && (
        <button
          onClick={() => setShowPickerModal(true)}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            borderRadius: "8px",
            background: "var(--accent)",
            color: "#000",
            border: "none",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          Add Players
        </button>
      )}

      {/* Captain/Vice-Captain Selector */}
      {isSquadComplete && (
        <CaptainSelector
          squad={squad}
          setSquad={setSquad}
          selectedPlayerIds={squad.selectedPlayerIds}
          findPlayerById={findPlayerById}
        />
      )}

      {/* Lock Squad Button */}
      {canLockSquad && (
        <button
          onClick={() => {
            console.log("Lock squad:", squad);
            // TODO: Call submitSquadOnchain()
          }}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "14px",
            borderRadius: "8px",
            background: "var(--accent)",
            color: "#000",
            border: "none",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            cursor: "pointer",
          }}
        >
          🔒 Lock Squad
        </button>
      )}

      {/* Player Picker Modal */}
      {showPickerModal && (
        <PlayerPickerModal
          onClose={() => setShowPickerModal(false)}
          onAddPlayer={handleAddPlayer}
          selectedPlayerIds={squad.selectedPlayerIds}
          budgetRemaining={budgetRemaining}
          formation={formation}
          findPlayerById={findPlayerById}
        />
      )}
    </div>
  );
}
