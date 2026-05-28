const NATION_FLAGS = {
  France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Brazil: "🇧🇷", Germany: "🇩🇪",
  Portugal: "🇵🇹", Spain: "🇪🇸", Argentina: "🇦🇷", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Croatia: "🇭🇷",
};

const POS_COLORS = {
  GK: { bg: "rgba(255,193,7,0.2)", text: "#FFC107" },
  DEF: { bg: "rgba(33,150,243,0.2)", text: "#2196F3" },
  MID: { bg: "rgba(0,232,122,0.2)", text: "#00E87A" },
  FWD: { bg: "rgba(255,71,87,0.2)", text: "#FF4757" },
};

function MiniJerseyCard({ player }) {
  const flag = NATION_FLAGS[player.nation] || "🏳️";
  const jerseyNum = player.id.split("_")[1]?.replace(/^0+/, "") || "?";
  const posStyle = POS_COLORS[player.pos] || POS_COLORS.MID;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 6, flexShrink: 0,
      background: posStyle.bg,
      border: `1px solid ${posStyle.text}44`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 0,
    }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{flag}</span>
      <span style={{ fontSize: 7, fontWeight: 800, color: posStyle.text, lineHeight: 1 }}>#{jerseyNum}</span>
    </div>
  );
}

export default function CaptainSelector({
  squad, setSquad, selectedPlayerIds, findPlayerById,
}) {
  const captainPlayer = findPlayerById(squad.captain);
  const viceCaptainPlayer = findPlayerById(squad.viceCaptain);

  function handleSelectCaptain(playerId) {
    setSquad(prev => ({
      ...prev,
      captain: playerId,
      viceCaptain: prev.viceCaptain === playerId ? null : prev.viceCaptain,
    }));
  }

  function handleSelectViceCaptain(playerId) {
    setSquad(prev => ({
      ...prev,
      viceCaptain: playerId,
      captain: prev.captain === playerId ? null : prev.captain,
    }));
  }

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 800, color: "var(--accent)",
        marginBottom: 14, textTransform: "uppercase", letterSpacing: 1,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        ⭐ Captain & Vice-Captain
      </div>

      {/* Current selections */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{
          flex: 1, padding: "10px 12px", borderRadius: 8,
          background: "rgba(255,215,0,0.06)",
          border: squad.captain ? "1px solid rgba(255,215,0,0.3)" : "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: squad.captain ? "#FFD700" : "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#000", flexShrink: 0,
          }}>C</div>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,215,0,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Captain</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: squad.captain ? "#FFD700" : "var(--grey2)" }}>
              {captainPlayer ? captainPlayer.name.split(" ").pop() : "Not set"}
            </div>
          </div>
        </div>

        <div style={{
          flex: 1, padding: "10px 12px", borderRadius: 8,
          background: "rgba(0,232,122,0.04)",
          border: squad.viceCaptain ? "1px solid rgba(0,232,122,0.2)" : "1px dashed rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: squad.viceCaptain ? "var(--accent)" : "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 900, color: "#000", flexShrink: 0,
          }}>V</div>
          <div>
            <div style={{ fontSize: 9, color: "rgba(0,232,122,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Vice</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: squad.viceCaptain ? "var(--accent)" : "var(--grey2)" }}>
              {viceCaptainPlayer ? viceCaptainPlayer.name.split(" ").pop() : "Not set"}
            </div>
          </div>
        </div>
      </div>

      {/* Player list — tap to assign */}
      <div style={{ fontSize: 9, color: "var(--grey)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
        Tap to assign — tap again to set vice-captain
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
        {selectedPlayerIds.map(playerId => {
          const player = findPlayerById(playerId);
          if (!player) return null;
          const isCaptain = squad.captain === playerId;
          const isVice = squad.viceCaptain === playerId;
          const posStyle = POS_COLORS[player.pos] || POS_COLORS.MID;

          return (
            <div
              key={playerId}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8,
                background: isCaptain
                  ? "rgba(255,215,0,0.08)"
                  : isVice
                  ? "rgba(0,232,122,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: isCaptain
                  ? "1px solid rgba(255,215,0,0.3)"
                  : isVice
                  ? "1px solid rgba(0,232,122,0.2)"
                  : "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <MiniJerseyCard player={player} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {player.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--grey)", marginTop: 1 }}>
                  {player.club} • <span style={{ color: posStyle.text }}>{player.pos}</span>
                </div>
              </div>

              {/* C / V buttons */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => handleSelectCaptain(playerId)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isCaptain ? "#FFD700" : "rgba(255,215,0,0.1)",
                    border: `1px solid ${isCaptain ? "#FFD700" : "rgba(255,215,0,0.3)"}`,
                    color: isCaptain ? "#000" : "rgba(255,215,0,0.6)",
                    fontSize: 11, fontWeight: 900, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >C</button>
                <button
                  onClick={() => handleSelectViceCaptain(playerId)}
                  disabled={isCaptain}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isVice ? "var(--accent)" : "rgba(0,232,122,0.08)",
                    border: `1px solid ${isVice ? "var(--accent)" : "rgba(0,232,122,0.2)"}`,
                    color: isVice ? "#000" : "rgba(0,232,122,0.5)",
                    fontSize: 11, fontWeight: 900,
                    cursor: isCaptain ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: isCaptain ? 0.3 : 1,
                    transition: "all 0.15s",
                  }}
                >V</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
