import { useState } from "react";
import { NATIONS, getNationList, getByPosition } from "./players.js";

export default function PlayerPickerModal({
  onClose,
  onAddPlayer,
  selectedPlayerIds,
  budgetRemaining,
  formation,
  findPlayerById,
}) {
  const [selectedNation, setSelectedNation] = useState("France");
  const [selectedPos, setSelectedPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const nationPlayers = NATIONS[selectedNation] || [];

  // Filter by search + position
  let filteredPlayers = nationPlayers;
  if (selectedPos) {
    filteredPlayers = filteredPlayers.filter(p => p.pos === selectedPos);
  }
  if (searchQuery) {
    filteredPlayers = filteredPlayers.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function canAddPlayer(player) {
    if (selectedPlayerIds.includes(player.id)) return false;
    if (budgetRemaining < player.price) return false;

    // Position limit
    const posCount = selectedPlayerIds.filter(id => {
      const p = findPlayerById(id);
      return p && p.pos === player.pos;
    }).length;
    const posLimit = formation[player.pos.toLowerCase()] || 0;
    if (posCount >= posLimit) return false;

    // Nation limit
    const nationCount = selectedPlayerIds.filter(id => {
      const p = findPlayerById(id);
      return p && p.nation === player.nation;
    }).length;
    if (nationCount >= 3) return false;

    return true;
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 999,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column",
      padding: "16px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>
          Pick Players
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--grey)",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search players..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "6px",
          border: "1px solid var(--grey2)",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: "12px",
        }}
      />

      {/* Nation Filter */}
      <div style={{ marginBottom: "12px" }}>
        <select
          value={selectedNation}
          onChange={(e) => setSelectedNation(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid var(--grey2)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: "12px",
          }}
        >
          {getNationList().map(nation => (
            <option key={nation} value={nation}>{nation}</option>
          ))}
        </select>
      </div>

      {/* Position Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {["GK", "DEF", "MID", "FWD"].map(pos => (
          <button
            key={pos}
            onClick={() => setSelectedPos(selectedPos === pos ? null : pos)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: selectedPos === pos ? "2px solid var(--accent)" : "1px solid var(--grey2)",
              background: selectedPos === pos ? "rgba(0,232,122,0.1)" : "transparent",
              color: selectedPos === pos ? "var(--accent)" : "var(--grey)",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Player List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "10px",
      }}>
        {filteredPlayers.map(player => {
          const isSelected = selectedPlayerIds.includes(player.id);
          const canAdd = canAddPlayer(player);

          return (
            <div
              key={player.id}
              onClick={() => canAdd && onAddPlayer(player.id)}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid var(--grey2)",
                background: isSelected ? "rgba(0,232,122,0.15)" : "rgba(255,255,255,0.02)",
                cursor: canAdd ? "pointer" : "not-allowed",
                opacity: canAdd ? 1 : 0.5,
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {/* Player Photo */}
              <img
                src={player.photo}
                alt={player.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  background: "var(--grey2)",
                }}
              />

              {/* Player Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                  {player.name}
                </div>
                <div style={{ fontSize: "10px", color: "var(--grey)" }}>
                  {player.club} • {player.nation}
                </div>
              </div>

              {/* Position Badge */}
              <div style={{
                padding: "4px 8px",
                borderRadius: "3px",
                background: "rgba(0,232,122,0.15)",
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                minWidth: "32px",
                textAlign: "center",
              }}>
                {player.pos}
              </div>

              {/* Price */}
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--accent)",
                minWidth: "45px",
                textAlign: "right",
              }}>
                {player.price}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
