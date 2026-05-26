import { useState } from "react";

export default function CaptainSelector({
  squad,
  setSquad,
  selectedPlayerIds,
  findPlayerById,
}) {
  const [showCaptainPicker, setShowCaptainPicker] = useState(false);
  const [showViceCaptainPicker, setShowViceCaptainPicker] = useState(false);

  const captainPlayer = findPlayerById(squad.captain);
  const viceCaptainPlayer = findPlayerById(squad.viceCaptain);

  function handleSelectCaptain(playerId) {
    setSquad(prev => ({
      ...prev,
      captain: playerId,
      viceCaptain: prev.viceCaptain === playerId ? null : prev.viceCaptain,
    }));
    setShowCaptainPicker(false);
  }

  function handleSelectViceCaptain(playerId) {
    setSquad(prev => ({
      ...prev,
      viceCaptain: playerId,
      captain: prev.captain === playerId ? null : prev.captain,
    }));
    setShowViceCaptainPicker(false);
  }

  return (
    <div style={{ marginTop: "20px", padding: "16px", borderRadius: "8px", background: "rgba(0,232,122,0.05)", border: "1px solid rgba(0,232,122,0.2)" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: 1 }}>
        Captain & Vice-Captain
      </div>

      {/* Captain Selector */}
      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={() => setShowCaptainPicker(!showCaptainPicker)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--grey2)",
            background: "rgba(255,255,255,0.02)",
            color: "var(--text)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Captain {captainPlayer && `• ${captainPlayer.name}`}
          </span>
          <span style={{ color: "var(--accent)" }}>▼</span>
        </button>

        {showCaptainPicker && (
          <div style={{
            marginTop: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "6px",
            border: "1px solid var(--grey2)",
            background: "var(--bg)",
          }}>
            {selectedPlayerIds.map(playerId => {
              const player = findPlayerById(playerId);
              if (!player) return null;

              return (
                <button
                  key={playerId}
                  onClick={() => handleSelectCaptain(playerId)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    background: squad.captain === playerId ? "rgba(0,232,122,0.1)" : "transparent",
                    color: squad.captain === playerId ? "var(--accent)" : "var(--text)",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid var(--grey2)",
                    fontWeight: squad.captain === playerId ? 700 : 400,
                  }}
                >
                  {player.name} ({player.pos}) {squad.captain === playerId && "✓"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Vice-Captain Selector */}
      <div>
        <button
          onClick={() => setShowViceCaptainPicker(!showViceCaptainPicker)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--grey2)",
            background: "rgba(255,255,255,0.02)",
            color: "var(--text)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Vice-Captain {viceCaptainPlayer && `• ${viceCaptainPlayer.name}`}
          </span>
          <span style={{ color: "var(--accent)" }}>▼</span>
        </button>

        {showViceCaptainPicker && (
          <div style={{
            marginTop: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "6px",
            border: "1px solid var(--grey2)",
            background: "var(--bg)",
          }}>
            {selectedPlayerIds.map(playerId => {
              const player = findPlayerById(playerId);
              if (!player) return null;
              if (playerId === squad.captain) return null; // Can't be vice-captain if captain

              return (
                <button
                  key={playerId}
                  onClick={() => handleSelectViceCaptain(playerId)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    background: squad.viceCaptain === playerId ? "rgba(0,232,122,0.1)" : "transparent",
                    color: squad.viceCaptain === playerId ? "var(--accent)" : "var(--text)",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid var(--grey2)",
                    fontWeight: squad.viceCaptain === playerId ? 700 : 400,
                  }}
                >
                  {player.name} ({player.pos}) {squad.viceCaptain === playerId && "✓"}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
