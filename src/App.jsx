import { useState, useEffect, useRef, Component, lazy, Suspense } from "react";
import { connectWallet, getExistingUsername } from "./wallet.js";

const SquadBuilder = lazy(() => import("./SquadBuilder.jsx"));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: "20px", color: "red" }}>Something went wrong. Refresh the page.</div>;
    }
    return this.props.children;
  }
}

function Logo({ size = 48, sub = false }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: size,
        fontWeight: 900,
        letterSpacing: -2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        marginBottom: sub ? 8 : 0,
      }}>
        <span style={{
          background: "linear-gradient(135deg, var(--accent), rgba(0,232,122,0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>W</span>
        <span style={{ fontSize: size * 0.85, WebkitTextFillColor: "initial" }}>⚽</span>
        <span style={{
          background: "linear-gradient(135deg, var(--accent), rgba(0,232,122,0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>RLDXI</span>
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: "var(--grey2)", textTransform: "uppercase", letterSpacing: 2 }}>
          Fantasy Football • World Cup 2026
        </div>
      )}
    </div>
  );
}

function VideoSplash({ onDone }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const startVideo = () => {
    if (started) return;
    setStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => onDone());
    }
    setTimeout(() => setShowSkip(true), 3000);
  };

  useEffect(() => {
    if (started) {
      const t = setTimeout(onDone, 42000);
      return () => clearTimeout(t);
    }
  }, [started]);

  return (
    <div
      onClick={startVideo}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "#000", overflow: "hidden", cursor: "pointer",
      }}
    >
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        src="/ed19dd204b248c32c2992d1c77faaf95.mp4"
        onEnded={onDone}
        onError={() => setTimeout(onDone, 500)}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          opacity: started ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {!started && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 3,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(0,232,122,0.15)",
            border: "2px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, animation: "pulse 2s ease-in-out infinite",
          }}>▶</div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 3,
            textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
          }}>Tap to enter</div>
        </div>
      )}

      {started && showSkip && (
        <div
          onClick={e => { e.stopPropagation(); onDone(); }}
          style={{
            position: "absolute", bottom: 52, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10, cursor: "pointer",
          }}
        >
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 3,
            textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
          }}>Tap anywhere to skip</div>
          <div style={{ width: 120, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "var(--accent)", borderRadius: 99,
              animation: "splashProgress 42s linear forwards",
            }} />
          </div>
        </div>
      )}
      <style>{`
        @keyframes splashProgress { from{width:0%} to{width:100%} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.8} }
      `}</style>
    </div>
  );
}

function ConnectScreen({ onConnect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    setLoading(true);
    try {
      const address = await connectWallet();
      onConnect(address);
    } catch (err) {
      setError(err.message || "Connection failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 998,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 32,
    }}>
      <Logo size={76} sub={true} />

      <div style={{ fontSize: 52, margin: "48px 0", filter: "drop-shadow(0 0 24px rgba(0,232,122,0.2))" }}>🏆</div>

      <div style={{ width: "100%", maxWidth: 320 }}>
        <button className="btn-accent" onClick={handleConnect} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Connecting..." : "Connect OKX Wallet"}
        </button>
        {error && (
          <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "var(--red)", lineHeight: 1.6 }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 14, textAlign: "center", fontSize: 11, color: "var(--grey)", lineHeight: 1.7 }}>
          Your wallet address is your identity.<br />No email. No password.
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 32,
        fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--grey2)",
      }}>
        Built on <span style={{ color: "var(--accent)" }}>X Layer</span>
      </div>
    </div>
  );
}

function SetUsernameScreen({ wallet, onDone }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    setError("");
    try {
      localStorage.setItem("worldxi_username", username);
      localStorage.setItem("worldxi_wallet", wallet);
      onDone(username);
    } catch (err) {
      setError(err.message || "Failed. Try again.");
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 998,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 32,
    }}>
      <Logo size={56} />

      <div style={{ marginTop: 40, width: "100%", maxWidth: 320 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grey2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          Wallet
        </div>
        <div style={{
          padding: 12, borderRadius: 6, background: "rgba(0,232,122,0.05)",
          border: "1px solid rgba(0,232,122,0.2)",
          fontSize: 11, fontFamily: "monospace", color: "var(--accent)",
          marginBottom: 20, wordBreak: "break-all",
        }}>
          {wallet}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grey2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          Manager Name
        </div>
        <input
          type="text"
          placeholder="3-20 chars (a-z, 0-9, _)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%", padding: 12, borderRadius: 6,
            border: "1px solid var(--grey2)", background: "var(--bg)",
            color: "var(--text)", fontSize: 12, marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        {error && (
          <div style={{ fontSize: 11, color: "var(--red)", marginBottom: 12 }}>{error}</div>
        )}
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          style={{
            width: "100%", padding: 12, borderRadius: 6,
            background: isValid ? "var(--accent)" : "var(--grey2)",
            color: "#000", border: "none", fontSize: 12, fontWeight: 700,
            cursor: isValid ? "pointer" : "not-allowed", opacity: saving ? 0.7 : 1,
            textTransform: "uppercase", letterSpacing: 1,
          }}
        >
          {saving ? "Saving..." : "Confirm Manager Name"}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ username }) {
  return (
    <div style={{ padding: "16px", background: "var(--bg)", minHeight: "100vh" }}>
      <Logo size={48} />
      <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--grey)" }}>
        Welcome, <span style={{ color: "var(--accent)", fontWeight: 700 }}>{username}</span>
      </div>
      <div style={{ marginTop: "32px", fontSize: "12px", color: "var(--grey)", lineHeight: 1.8 }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: 1 }}>
            Leaderboard
          </div>
          <div>Coming soon...</div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: 1 }}>
            Your Points
          </div>
          <div>0 pts</div>
        </div>
      </div>
    </div>
  );
}

function TransfersScreen() {
  return (
    <div style={{ padding: "16px", background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: 1 }}>
        Transfers
      </div>
      <div style={{ fontSize: "12px", color: "var(--grey)" }}>
        Coming soon...
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  return (
    <div style={{ padding: "16px", background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: 1 }}>
        Leaderboard
      </div>
      <div style={{ fontSize: "12px", color: "var(--grey)" }}>
        Coming soon...
      </div>
    </div>
  );
}

function WorldXIAppInner() {
  // Restore session from localStorage on mount
  const [wallet, setWallet] = useState(() => localStorage.getItem("worldxi_wallet") || null);
  const [username, setUsername] = useState(() => localStorage.getItem("worldxi_username") || null);
  const [activeTab, setActiveTab] = useState("home");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [squad, setSquad] = useState({
    selectedPlayerIds: [],
    captain: null,
    viceCaptain: null,
  });

  const audioRef = useRef(null);

  // Autoplay music — starts muted until user interacts (browser policy)
  useEffect(() => {
    if (musicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicPlaying]);

  // If wallet already in localStorage, skip connect screen
  // but still try to get username from chain as fallback
  useEffect(() => {
    const savedWallet = localStorage.getItem("worldxi_wallet");
    const savedUsername = localStorage.getItem("worldxi_username");
    if (savedWallet && !savedUsername) {
      getExistingUsername(savedWallet).then(name => {
        if (name) {
          setUsername(name);
          localStorage.setItem("worldxi_username", name);
        }
      }).catch(() => {});
    }
  }, []);

  const handleConnect = async (address) => {
    setWallet(address);
    localStorage.setItem("worldxi_wallet", address);
    const localUsername = localStorage.getItem("worldxi_username");
    if (localUsername) {
      setUsername(localUsername);
      return;
    }
    try {
      const existingUsername = await getExistingUsername(address);
      if (existingUsername) {
        setUsername(existingUsername);
        localStorage.setItem("worldxi_username", existingUsername);
      }
    } catch (_) {}
  };

  const handleUsernameSet = (name) => {
    setUsername(name);
  };

  // Start music when app is ready
  const handleAppReady = () => {
    setMusicPlaying(true);
  };

  if (!wallet) {
    return <ConnectScreen onConnect={handleConnect} />;
  }

  if (!username) {
    return <SetUsernameScreen wallet={wallet} onDone={handleUsernameSet} />;
  }

  let tabContent;
  switch (activeTab) {
    case "home":
      tabContent = <HomeScreen username={username} />;
      break;
    case "squad":
      tabContent = (
        <Suspense fallback={<div style={{ padding: "20px", color: "var(--grey)", textAlign: "center" }}>Loading squad builder...</div>}>
          <SquadBuilder squad={squad} setSquad={setSquad} />
        </Suspense>
      );
      break;
    case "transfers":
      tabContent = <TransfersScreen />;
      break;
    case "leaderboard":
      tabContent = <LeaderboardScreen />;
      break;
    default:
      tabContent = <HomeScreen username={username} />;
  }

  return (
    <div
      style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}
      onClick={handleAppReady}
    >
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "70px" }}>
        {tabContent}
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "60px", background: "var(--bg)", borderTop: "1px solid var(--grey2)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        zIndex: 100,
      }}>
        {[
          { id: "home", label: "Home", icon: "🏠" },
          { id: "squad", label: "Squad", icon: "⚽" },
          { id: "transfers", label: "Transfers", icon: "🔄" },
          { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, height: "100%", border: "none", background: "transparent",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "4px", cursor: "pointer",
              color: activeTab === tab.id ? "var(--accent)" : "var(--grey2)",
              fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <div style={{ fontSize: "16px" }}>{tab.icon}</div>
            <div>{tab.label}</div>
          </button>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setMusicPlaying(!musicPlaying); }}
        style={{
          position: "fixed", top: "12px", right: "12px", zIndex: 101,
          width: "40px", height: "40px", borderRadius: "50%",
          background: "rgba(0,232,122,0.1)", border: "1px solid var(--grey2)",
          color: "var(--accent)", fontSize: "16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title="Toggle music"
      >
        {musicPlaying ? "🔊" : "🔇"}
      </button>

      <audio
        ref={audioRef}
        src="/waka-waka.mp3"
        loop
        style={{ display: "none" }}
      />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Skip splash on reload if already visited
    return !localStorage.getItem("worldxi_visited");
  });

  const handleSplashDone = () => {
    localStorage.setItem("worldxi_visited", "1");
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Inter", sans-serif; }
        :root {
          --bg: #080e1a;
          --text: #ffffff;
          --grey: #8b92a9;
          --grey2: #4a5568;
          --accent: #00E87A;
          --red: #FF4757;
        }
        .btn-accent {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          background: var(--accent);
          color: #000;
          border: none;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
        }
        .btn-accent:hover { opacity: 0.9; }
      `}</style>

      {showSplash ? (
        <VideoSplash onDone={handleSplashDone} />
      ) : (
        <WorldXIAppInner />
      )}
    </ErrorBoundary>
  );
}
