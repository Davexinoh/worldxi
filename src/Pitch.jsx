import { useState } from "react";

export default function Pitch({
  selectedPlayerIds,
  formation,
  findPlayerById,
  onSwap,
  onRemove,
  captain,
  viceCaptain,
}) {
  const [draggedPlayerId, setDraggedPlayerId] = useState(null);

  // Organize players by position in formation
  const gk = selectedPlayerIds.filter(id => {
    const p = findPlayerById(id);
    return p && p.pos === "GK";
  });

  const def = selectedPlayerIds.filter(id => {
    const p = findPlayerById(id);
    return p && p.pos === "DEF";
  });

  const mid = selectedPlayerIds.filter(id => {
    const p = findPlayerById(id);
    return p && p.pos === "MID";
  });

  const fwd = selectedPlayerIds.filter(id => {
    const p = findPlayerById(id);
    return p && p.pos === "FWD";
  });

  function handleDragStart(e, playerId) {
    setDraggedPlayerId(playerId);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDropOnPlayer(e, targetPlayerId) {
    e.preventDefault();
    if (draggedPlayerId && draggedPlayerId !== targetPlayerId) {
      onSwap(draggedPlayerId, targetPlayerId);
    }
    setDraggedPlayerId(null);
  }

  function PlayerSlot({ playerId, isDragging }) {
    const player = findPlayerById(playerId);
    if (!player) return null;

    const isCaptain = captain === playerId;
    const isViceCaptain = viceCaptain === playerId;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, playerId)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnPlayer(e, playerId)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          background: isDragging ? "rgba(0,232,122,0.2)" : "rgba(255,255,255,0.05)",
          border: isCaptain ? "2px solid var(--accent)" : isViceCaptain ? "2px solid rgba(0,232,122,0.5)" : "1px solid var(--grey2)",
          cursor: "grab",
          textAlign: "center",
          minHeight: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={player.photo}
          alt={player.name}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "4px",
          }}
        />
        <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          {player.name.split(" ").pop()}
        </div>
        <div style={{ fontSize: "8px", color: "var(--grey)" }}>#{player.id}</div>

        {/* Captain Badge */}
        {isCaptain && (
          <div style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "var(--accent)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
          }}>
            C
          </div>
        )}

        {/* Vice-Captain Badge */}
        {isViceCaptain && (
          <div style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "rgba(0,232,122,0.5)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
          }}>
            V
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(playerId);
          }}
          style={{
            position: "absolute",
            bottom: "2px",
            right: "2px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "var(--red)",
            border: "none",
            color: "#fff",
            fontSize: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(to bottom, #1a4d2e 0%, #0f3d23 100%)",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      border: "2px solid rgba(0,232,122,0.2)",
    }}>
      {/* Formation Title */}
      <div style={{
        fontSize: "11px",
        color: "var(--grey2)",
        textAlign: "center",
        marginBottom: "16px",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: 600,
      }}>
        {formation.name} Formation
      </div>

      {/* Goalkeeper */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "8px" }}>
          {gk.map(id => (
            <PlayerSlot key={id} playerId={id} isDragging={draggedPlayerId === id} />
          ))}
        </div>
      </div>

      {/* Defenders */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(def.length, formation.def)}, 1fr)`, gap: "8px" }}>
          {def.map(id => (
            <PlayerSlot key={id} playerId={id} isDragging={draggedPlayerId === id} />
          ))}
        </div>
      </div>

      {/* Midfielders */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(mid.length, formation.mid)}, 1fr)`, gap: "8px" }}>
          {mid.map(id => (
            <PlayerSlot key={id} playerId={id} isDragging={draggedPlayerId === id} />
          ))}
        </div>
      </div>

      {/* Forwards */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(fwd.length, formation.fwd)}, 1fr)`, gap: "8px" }}>
          {fwd.map(id => (
            <PlayerSlot key={id} playerId={id} isDragging={draggedPlayerId === id} />
          ))}
        </div>
      </div>
    </div>
  );
}
