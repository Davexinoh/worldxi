import { useRef, useEffect } from "react";

const NATION_FLAGS = {
  France: "🇫🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Brazil: "🇧🇷", Germany: "🇩🇪",
  Portugal: "🇵🇹", Spain: "🇪🇸", Argentina: "🇦🇷", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Croatia: "🇭🇷",
};

const POS_COLORS = {
  GK: "#FFC107", DEF: "#2196F3", MID: "#00E87A", FWD: "#FF4757",
};

export default function SquadCard({ squad, findPlayerById, username, txHash, onClose }) {
  const canvasRef = useRef(null);

  const W = 600;
  const H = 900;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#080e1a";
    ctx.fillRect(0, 0, W, H);

    // Pitch gradient
    const pitchGrad = ctx.createRadialGradient(W / 2, 200, 0, W / 2, 200, 400);
    pitchGrad.addColorStop(0, "rgba(0,120,50,0.35)");
    pitchGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = pitchGrad;
    ctx.fillRect(0, 0, W, H);

    // Pitch stripes
    ctx.globalAlpha = 0.04;
    for (let y = 0; y < H; y += 48) {
      ctx.fillStyle = "rgba(0,180,70,1)";
      ctx.fillRect(0, y, W, 24);
    }
    ctx.globalAlpha = 1;

    // Center circle
    ctx.beginPath();
    ctx.arc(W / 2, 460, 70, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(40, 460); ctx.lineTo(W - 40, 460);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.stroke();

    // Header — WorldXI branding
    ctx.fillStyle = "#00E87A";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("W⚽RLDXI", W / 2, 52);

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px Arial";
    ctx.fillText("ONCHAIN FANTASY FOOTBALL • WORLD CUP 2026", W / 2, 72);

    // Manager name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.fillText(username?.toUpperCase() || "MANAGER", W / 2, 100);

    // Divider
    ctx.beginPath();
    ctx.moveTo(40, 114); ctx.lineTo(W - 40, 114);
    ctx.strokeStyle = "rgba(0,232,122,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Player layout — rows by position
    const gk = squad.selectedPlayerIds.filter(id => findPlayerById(id)?.pos === "GK");
    const def = squad.selectedPlayerIds.filter(id => findPlayerById(id)?.pos === "DEF");
    const mid = squad.selectedPlayerIds.filter(id => findPlayerById(id)?.pos === "MID");
    const fwd = squad.selectedPlayerIds.filter(id => findPlayerById(id)?.pos === "FWD");

    const rows = [
      { players: fwd.slice(0, 3), y: 155 },
      { players: mid.slice(0, 5), y: 265 },
      { players: def.slice(0, 5), y: 375 },
      { players: gk.slice(0, 1), y: 480 },
    ];

    function drawPlayer(id, x, y) {
      const player = findPlayerById(id);
      if (!player) return;
      const flag = NATION_FLAGS[player.nation] || "🏳";
      const jerseyNum = player.id.split("_")[1]?.replace(/^0+/, "") || "?";
      const posColor = POS_COLORS[player.pos] || "#00E87A";
      const isCaptain = squad.captain === id;
      const isVice = squad.viceCaptain === id;
      const lastName = player.name.split(" ").pop();

      const cardW = 68;
      const cardH = 80;
      const cx = x - cardW / 2;
      const cy = y - cardH / 2;

      // Card background
      ctx.fillStyle = isCaptain ? "rgba(255,215,0,0.15)" : `${posColor}22`;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 8);
      ctx.fill();

      // Card border
      ctx.strokeStyle = isCaptain ? "#FFD700" : isVice ? "#00E87A" : posColor;
      ctx.lineWidth = isCaptain ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 8);
      ctx.stroke();

      // Flag emoji
      ctx.font = "22px Arial";
      ctx.textAlign = "center";
      ctx.fillText(flag, x, cy + 28);

      // Jersey number
      ctx.fillStyle = posColor;
      ctx.font = "bold 10px Arial";
      ctx.fillText(`#${jerseyNum}`, x, cy + 44);

      // Captain / Vice badge
      if (isCaptain || isVice) {
        ctx.fillStyle = isCaptain ? "#FFD700" : "#00E87A";
        ctx.beginPath();
        ctx.arc(cx + cardW - 8, cy + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "bold 8px Arial";
        ctx.fillText(isCaptain ? "C" : "V", cx + cardW - 8, cy + 11);
      }

      // Player name
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      const shortName = lastName.length > 9 ? lastName.slice(0, 9) + "." : lastName;
      ctx.fillText(shortName, x, cy + 58);

      // Pos tag
      ctx.fillStyle = posColor;
      ctx.font = "bold 8px Arial";
      ctx.fillText(player.pos, x, cy + 70);
    }

    rows.forEach(({ players, y }) => {
      if (players.length === 0) return;
      const spacing = (W - 80) / players.length;
      players.forEach((id, i) => {
        const x = 40 + spacing * i + spacing / 2;
        drawPlayer(id, x, y);
      });
    });

    // Bench players
    const bench = squad.selectedPlayerIds.filter(id => {
      const p = findPlayerById(id);
      const inRows = [
        ...fwd.slice(0, 3), ...mid.slice(0, 5),
        ...def.slice(0, 5), ...gk.slice(0, 1)
      ];
      return !inRows.includes(id);
    });

    if (bench.length > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.roundRect(20, 560, W - 40, 90, 8);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      ctx.fillText("BENCH", W / 2, 578);

      const bSpacing = (W - 80) / Math.max(bench.length, 4);
      bench.forEach((id, i) => {
        drawPlayer(id, 40 + bSpacing * i + bSpacing / 2, 620);
      });
    }

    // Footer
    ctx.fillStyle = "rgba(0,232,122,0.15)";
    ctx.fillRect(0, H - 80, W, 80);

    ctx.fillStyle = "#00E87A";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🔒 LOCKED ON X LAYER", W / 2, H - 52);

    if (txHash && txHash !== "already-submitted") {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "9px Arial";
      ctx.fillText(`TX: ${txHash.slice(0, 28)}...`, W / 2, H - 34);
    }

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "9px Arial";
    ctx.fillText("worldxi.onrender.com  •  @PlayWorldXI", W / 2, H - 16);

  }, [squad, username, txHash]);

  function handleDownload() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `worldxi-squad-${username || "manager"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleShare() {
    const captain = findPlayerById(squad.captain);
    const text = `⚽ I just locked my World Cup 2026 fantasy squad onchain!\n\nCaptain: ${captain?.name || "TBA"} ⭐\n\n🔒 Verified on X Layer\n🎮 worldxi.onrender.com\n\n@PlayWorldXI`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 16, overflowY: "auto",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#00E87A" }}>Your Squad Card</div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none",
            color: "#fff", fontSize: 18, cursor: "pointer",
            width: 32, height: 32, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            width: "100%", borderRadius: 12,
            border: "1px solid rgba(0,232,122,0.2)",
          }}
        />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            onClick={handleDownload}
            style={{
              flex: 1, padding: "13px", borderRadius: 10,
              background: "linear-gradient(135deg, #00E87A, #00c96a)",
              color: "#000", border: "none", fontSize: 12, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: 1, cursor: "pointer",
            }}
          >
            ⬇️ Download PNG
          </button>
          <button
            onClick={handleShare}
            style={{
              flex: 1, padding: "13px", borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 12, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: 1, cursor: "pointer",
            }}
          >
            🐦 Share on X
          </button>
        </div>
      </div>
    </div>
  );
}
