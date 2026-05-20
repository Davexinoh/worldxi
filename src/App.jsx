import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

:root {
  --bg:        #080e1a;
  --surface:   #0d1525;
  --surface2:  #111d30;
  --navy:      #0A1628;
  --border:    rgba(255,255,255,0.08);
  --accent:    #00E87A;
  --accent-dim:rgba(0,232,122,0.1);
  --gold:      #F5C518;
  --gold-dim:  rgba(245,197,24,0.1);
  --red:       #FF4757;
  --white:     #FFFFFF;
  --grey:      rgba(255,255,255,0.45);
  --grey2:     rgba(255,255,255,0.2);
  --tab-h:     64px;
}

html, body, #root {
  height: 100%; width: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--white);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.app { height: 100%; display: flex; flex-direction: column; overflow: hidden; }

.screen { flex: 1; overflow-y: auto; overflow-x: hidden; padding-bottom: var(--tab-h); scrollbar-width: none; }
.screen::-webkit-scrollbar { display: none; }
.screen-enter { animation: screenIn 0.22s ease forwards; }
@keyframes screenIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

/* ── VIDEO SPLASH ── */
.vsplash {
  position: fixed; inset: 0; z-index: 999;
  background: #000; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.vsplash video {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.vsplash-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%);
  z-index: 1;
}
.vsplash-skip {
  position: absolute; bottom: 52px; left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.vsplash-skip-text {
  font-size: 11px; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}
.vsplash-progress {
  width: 120px; height: 2px;
  background: rgba(255,255,255,0.15);
  border-radius: 99px; overflow: hidden;
}
.vsplash-progress-fill {
  height: 100%; background: var(--accent);
  border-radius: 99px;
  animation: splashProgress 8s linear forwards;
}
@keyframes splashProgress { from { width:0%; } to { width:100%; } }
@keyframes loadBar { from { width:0%; } to { width:100%; } }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ── CONNECT SCREEN ── */
.connect-screen {
  position: fixed; inset: 0; z-index: 998;
  background: var(--bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 32px;
}
.logo-lockup {
  text-align: center; margin-bottom: 56px;
}
.logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 80px; letter-spacing: 6px; line-height: 1;
  color: var(--white);
}
.logo-text .xi { color: var(--accent); }
.logo-tagline {
  font-size: 11px; font-weight: 500;
  letter-spacing: 4px; text-transform: uppercase;
  color: var(--grey); margin-top: 8px;
}
.logo-bar {
  width: 48px; height: 2px;
  background: var(--accent);
  margin: 14px auto 0; border-radius: 99px;
}
.connect-trophy { font-size: 56px; margin-bottom: 48px; filter: drop-shadow(0 0 24px rgba(0,232,122,0.25)); }
.connect-actions { width: 100%; max-width: 320px; }
.btn-accent {
  width: 100%; padding: 16px;
  background: var(--accent); color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  border: none; border-radius: 4px;
  cursor: pointer; margin-bottom: 12px;
  transition: opacity 0.15s;
}
.btn-accent:active { opacity: 0.8; }
.btn-ghost {
  width: 100%; padding: 16px;
  background: transparent; color: var(--grey);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  border: 1px solid var(--border); border-radius: 4px;
  cursor: pointer; transition: border-color 0.15s;
}
.btn-ghost:active { border-color: var(--grey); }
.connect-note {
  margin-top: 16px; text-align: center;
  font-size: 11px; color: var(--grey); line-height: 1.6;
}
.connect-chain {
  position: absolute; bottom: 32px;
  font-size: 11px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--grey2);
}
.connect-chain span { color: var(--accent); }

/* ── USERNAME SCREEN ── */
.username-screen {
  position: fixed; inset: 0; z-index: 997;
  background: var(--bg);
  display: flex; flex-direction: column;
  padding: 60px 28px 40px;
}
.username-step {
  font-size: 10px; font-weight: 600;
  letter-spacing: 4px; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
}
.username-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 44px; letter-spacing: 2px; line-height: 1;
  margin-bottom: 12px;
}
.username-title span { color: var(--accent); }
.username-desc {
  font-size: 14px; color: var(--grey);
  line-height: 1.7; margin-bottom: 36px;
}
.username-input {
  width: 100%;
  background: var(--surface);
  border-radius: 6px;
  padding: 16px 18px;
  font-size: 20px; font-weight: 700;
  color: var(--white);
  outline: none;
  font-family: 'Barlow Condensed', sans-serif;
  letter-spacing: 1px; margin-bottom: 8px;
  transition: border 0.15s;
}
.username-meta {
  display: flex; justify-content: space-between;
  font-size: 11px; margin-bottom: 20px;
}
.username-rules {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 8px;
  margin-bottom: 36px;
}
.rule-row {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px;
}

/* ── BOTTOM TAB BAR ── */
.tab-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: var(--tab-h);
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex; z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 4px; cursor: pointer; position: relative;
  transition: opacity 0.15s;
}
.tab:active { opacity: 0.7; }
.tab-icon { font-size: 20px; line-height: 1; }
.tab-label {
  font-size: 9px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--grey2); transition: color 0.15s;
}
.tab.active .tab-label { color: var(--accent); }
.tab-pip {
  position: absolute; top: 6px;
  width: 24px; height: 2px;
  background: var(--accent);
  border-radius: 99px; opacity: 0;
  transition: opacity 0.15s;
}
.tab.active .tab-pip { opacity: 1; }

/* ── SCREEN HEADER ── */
.screen-header {
  padding: 20px 20px 0;
  display: flex; align-items: center; justify-content: space-between;
}
.screen-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px; letter-spacing: 2px;
}
.screen-title span { color: var(--accent); }
.header-badge {
  font-size: 10px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent); background: var(--accent-dim);
  border: 1px solid rgba(0,232,122,0.25);
  padding: 5px 12px; border-radius: 3px;
}

/* ── HOME ── */
.rank-card {
  margin: 16px 20px 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px; padding: 16px;
  display: flex; align-items: center; gap: 16px;
}
.rank-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px; line-height: 1;
  color: var(--accent); min-width: 60px;
}
.rank-info { flex: 1; }
.rank-label {
  font-size: 10px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--grey); margin-bottom: 4px;
}
.rank-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px; font-weight: 800; color: var(--white);
}
.rank-pts span { color: var(--grey); font-size: 14px; font-weight: 400; }
.rank-delta { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; color: var(--accent); }

.stats-row {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 10px; margin: 14px 20px 0;
}
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 16px 12px; text-align: center;
}
.stat-card-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 36px; line-height: 1; color: var(--accent);
}
.stat-card-label {
  font-size: 9px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--grey); margin-top: 4px;
}

.section-label {
  font-size: 10px; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--grey); padding: 0 20px; margin-bottom: 12px;
}

.matchday-card {
  margin: 16px 20px 0;
  background: var(--surface);
  border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
}
.matchday-header {
  background: var(--accent);
  padding: 10px 16px;
  display: flex; justify-content: space-between; align-items: center;
}
.matchday-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 800;
  letter-spacing: 2px; text-transform: uppercase; color: #000;
}
.matchday-live {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px; font-weight: 700; color: rgba(0,0,0,0.6);
}
.fixtures { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.fixture {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px;
  background: var(--surface2);
  border-radius: 6px; border: 1px solid var(--border);
}
.fixture-team { font-size: 13px; font-weight: 600; flex: 1; }
.fixture-team.right { text-align: right; }
.fixture-score {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px; font-weight: 800;
  letter-spacing: 2px; color: var(--accent);
  padding: 0 14px; min-width: 60px; text-align: center;
}
.fixture-time {
  font-size: 9px; font-weight: 600;
  letter-spacing: 1px; color: var(--accent); text-align: center;
}

.squad-strip {
  display: flex; gap: 10px;
  padding: 0 20px;
  overflow-x: auto; scrollbar-width: none;
  margin-bottom: 20px;
}
.squad-strip::-webkit-scrollbar { display: none; }
.player-chip {
  flex-shrink: 0; width: 72px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.player-avatar {
  width: 52px; height: 52px;
  background: var(--surface2);
  border-radius: 50%; border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; position: relative;
}
.player-avatar.captain::after {
  content: 'C'; position: absolute; top: -3px; right: -3px;
  width: 16px; height: 16px;
  background: var(--accent); color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px; font-weight: 800;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.player-name {
  font-size: 10px; font-weight: 600; color: var(--white);
  text-align: center; width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.player-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 700; color: var(--gold);
}

/* ── SQUAD ── */
.pos-badge { font-size: 8px; font-weight: 700; letter-spacing: 1px; padding: 2px 6px; border-radius: 2px; }
.pos-GK  { background: rgba(245,197,24,0.15); color: var(--gold); }
.pos-DEF { background: rgba(0,232,122,0.12); color: var(--accent); }
.pos-MID { background: rgba(100,149,237,0.15); color: #6495ED; }
.pos-FWD { background: rgba(255,71,87,0.15); color: var(--red); }

.squad-info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 20px;
  background: var(--surface);
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.squad-budget {
  font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700;
}
.squad-budget span { color: var(--accent); }

.pitch {
  position: relative; margin: 0 20px 16px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden; padding: 16px 0;
}
.pitch-lines {
  position: absolute; inset: 0; opacity: 0.03;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px);
}
.pitch-pos-label {
  font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
  color: var(--grey2); text-align: center; margin-bottom: 8px; position: relative; z-index: 1;
}
.pitch-row {
  display: flex; justify-content: center; gap: 8px;
  margin-bottom: 14px; position: relative; z-index: 1;
}
.pitch-player {
  display: flex; flex-direction: column; align-items: center; gap: 4px; width: 64px;
}
.pitch-avatar {
  width: 46px; height: 46px;
  background: var(--surface2); border: 2px solid var(--border);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 18px; position: relative; cursor: pointer;
}
.pitch-avatar.captain-mark::after {
  content: 'C'; position: absolute; top: -3px; right: -3px;
  width: 15px; height: 15px;
  background: var(--accent); color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px; font-weight: 800;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.pitch-pname {
  font-size: 9px; font-weight: 600; color: var(--white);
  text-align: center; width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.pitch-ppts {
  font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; color: var(--gold);
}

.bench-section { padding: 0 20px 16px; }
.bench-row {
  display: flex; gap: 10px; padding: 14px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
}

.wildcard-card {
  margin: 0 20px 20px;
  background: var(--surface);
  border: 1px solid rgba(0,232,122,0.2);
  border-radius: 8px; padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.wildcard-badge {
  font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  color: var(--accent); background: var(--accent-dim);
  border: 1px solid rgba(0,232,122,0.3);
  padding: 6px 14px; border-radius: 3px;
}

/* ── TRANSFERS ── */
.transfer-filters {
  display: flex; gap: 8px; padding: 16px 20px 0;
  overflow-x: auto; scrollbar-width: none;
}
.transfer-filters::-webkit-scrollbar { display: none; }
.filter-chip {
  flex-shrink: 0; font-size: 11px; font-weight: 600;
  letter-spacing: 1px; padding: 7px 16px;
  border: 1px solid var(--border); border-radius: 99px;
  color: var(--grey); background: var(--surface);
  cursor: pointer; white-space: nowrap; transition: all 0.15s;
}
.filter-chip.active { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }

.player-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }
.player-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer; transition: border-color 0.15s;
}
.player-row:active { border-color: var(--accent); }
.player-row-avatar {
  width: 44px; height: 44px; background: var(--surface2);
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 20px; flex-shrink: 0;
}
.player-row-info { flex: 1; }
.player-row-name { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.player-row-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--grey); }
.player-row-price {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px; font-weight: 700; color: var(--gold);
}
.form-dot { width: 6px; height: 6px; border-radius: 50%; }
.form-dot.good { background: var(--accent); }
.form-dot.ok   { background: var(--gold); }
.form-dot.bad  { background: var(--red); }

/* ── LEADERBOARD ── */
.lb-top3 {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 12px; padding: 24px 20px 20px;
}
.lb-podium { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.lb-podium-avatar {
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 24px; border: 2px solid var(--border); background: var(--surface2);
}
.lb-podium.first .lb-podium-avatar {
  width: 64px; height: 64px;
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(0,232,122,0.25);
}
.lb-podium.second .lb-podium-avatar,
.lb-podium.third  .lb-podium-avatar { width: 52px; height: 52px; }
.lb-podium-name { font-size: 11px; font-weight: 600; text-align: center; }
.lb-podium-pts { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; color: var(--accent); }
.lb-rank-badge { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--accent); }

.lb-list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }
.lb-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 8px;
}
.lb-row.me { border-color: rgba(0,232,122,0.35); background: var(--accent-dim); }
.lb-pos { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--grey2); min-width: 28px; }
.lb-row.me .lb-pos { color: var(--accent); }
.lb-avatar { width: 40px; height: 40px; background: var(--surface2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.lb-name { flex: 1; font-size: 14px; font-weight: 600; }
.lb-pts { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; color: var(--accent); }
.lb-delta { font-size: 11px; color: var(--accent); font-weight: 600; }

.divider-line { height: 1px; background: var(--border); margin: 0 20px 20px; }
`;

/* ── MOCK DATA ── */
const mySquad = [
  { name:"Courtois",   pos:"GK",  pts:8,  flag:"🇧🇪", captain:false },
  { name:"Cancelo",    pos:"DEF", pts:9,  flag:"🇵🇹", captain:false },
  { name:"Rüdiger",    pos:"DEF", pts:6,  flag:"🇩🇪", captain:false },
  { name:"Dias",       pos:"DEF", pts:11, flag:"🇵🇹", captain:false },
  { name:"Theo H.",    pos:"DEF", pts:7,  flag:"🇫🇷", captain:false },
  { name:"Bellingham", pos:"MID", pts:14, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain:false },
  { name:"De Bruyne",  pos:"MID", pts:12, flag:"🇧🇪", captain:false },
  { name:"Pedri",      pos:"MID", pts:9,  flag:"🇪🇸", captain:false },
  { name:"Vinicius",   pos:"MID", pts:10, flag:"🇧🇷", captain:false },
  { name:"Mbappe",     pos:"FWD", pts:18, flag:"🇫🇷", captain:true  },
  { name:"Haaland",    pos:"FWD", pts:15, flag:"🇳🇴", captain:false },
];
const bench = [
  { name:"Sommer",  pos:"GK",  pts:2, flag:"🇨🇭" },
  { name:"Militão", pos:"DEF", pts:4, flag:"🇧🇷" },
  { name:"Nkunku",  pos:"MID", pts:5, flag:"🇫🇷" },
  { name:"Osimhen", pos:"FWD", pts:6, flag:"🇳🇬" },
];
const allPlayers = [
  { name:"Mbappe",     pos:"FWD", nat:"France",   price:13.5, pts:18, flag:"🇫🇷", form:"good" },
  { name:"Haaland",    pos:"FWD", nat:"Norway",   price:13.0, pts:15, flag:"🇳🇴", form:"good" },
  { name:"Vinicius",   pos:"MID", nat:"Brazil",   price:12.0, pts:10, flag:"🇧🇷", form:"good" },
  { name:"Bellingham", pos:"MID", nat:"England",  price:11.5, pts:14, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", form:"good" },
  { name:"De Bruyne",  pos:"MID", nat:"Belgium",  price:11.0, pts:12, flag:"🇧🇪", form:"ok"   },
  { name:"Pedri",      pos:"MID", nat:"Spain",    price:9.5,  pts:9,  flag:"🇪🇸", form:"ok"   },
  { name:"Osimhen",    pos:"FWD", nat:"Nigeria",  price:9.0,  pts:6,  flag:"🇳🇬", form:"bad"  },
  { name:"Dias",       pos:"DEF", nat:"Portugal", price:7.5,  pts:11, flag:"🇵🇹", form:"good" },
  { name:"Courtois",   pos:"GK",  nat:"Belgium",  price:7.0,  pts:8,  flag:"🇧🇪", form:"ok"   },
  { name:"Cancelo",    pos:"DEF", nat:"Portugal", price:7.0,  pts:9,  flag:"🇵🇹", form:"ok"   },
];
const leaderboard = [
  { name:"ElKing",    pts:412, delta:"+18", flag:"🇳🇬" },
  { name:"TacticoX",  pts:398, delta:"+6",  flag:"🇧🇷" },
  { name:"PitchGod",  pts:387, delta:"+11", flag:"🇬🇧" },
  { name:"You",       pts:371, delta:"+14", flag:"🫵", me:true },
  { name:"Alvarado",  pts:364, delta:"+3",  flag:"🇪🇸" },
  { name:"NaijaBoss", pts:358, delta:"+7",  flag:"🇳🇬" },
  { name:"FutbolFC",  pts:341, delta:"-2",  flag:"🇩🇪" },
  { name:"GoldenXI",  pts:329, delta:"+9",  flag:"🇫🇷" },
];
const fixtures = [
  { home:"🇫🇷 France",  away:"Brazil 🇧🇷",   score:"2 — 1", live:true  },
  { home:"🇩🇪 Germany", away:"Spain 🇪🇸",    score:"14:00", live:false },
  { home:"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", away:"Portugal 🇵🇹", score:"17:00", live:false },
];

/* ── LOGO COMPONENT ── */
function Logo({ size = 72, sub = true }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{
        fontFamily:"'Bebas Neue', sans-serif",
        fontSize: size, letterSpacing: 6, lineHeight: 1,
        color:"var(--white)",
      }}>
        W<span style={{ color:"var(--accent)" }}>⚽</span>RLD
        <span style={{ color:"var(--accent)" }}>XI</span>
      </div>
      {sub && (
        <div style={{
          fontSize:11, fontWeight:500,
          letterSpacing:4, textTransform:"uppercase",
          color:"var(--grey)", marginTop:6,
        }}>Onchain Fantasy Football</div>
      )}
    </div>
  );
}

/* ── SCREENS ── */
function HomeScreen({ username }) {
  const totalPts = mySquad.reduce((a,p) => a + (p.captain ? p.pts*2 : p.pts), 0);
  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop:28 }}>
        <div>
          <div className="screen-title">W<span>⚽</span>RLD<span>XI</span></div>
          <div style={{ fontSize:11, color:"var(--grey)", marginTop:2 }}>GM, {username} 👋</div>
        </div>
        <div className="header-badge">MD 3 LIVE</div>
      </div>

      <div style={{ height:16 }} />

      {/* Rank */}
      <div className="rank-card">
        <div className="rank-num">#4</div>
        <div className="rank-info">
          <div className="rank-label">Your Rank</div>
          <div className="rank-pts">{totalPts} <span>pts</span></div>
        </div>
        <div className="rank-delta">▲ 14</div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-num">11</div>
          <div className="stat-card-label">Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num">1</div>
          <div className="stat-card-label">Free Transfer</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-num" style={{ color:"var(--red)" }}>3</div>
          <div className="stat-card-label">Days Left</div>
        </div>
      </div>

      {/* Fixtures */}
      <div style={{ padding:"16px 20px 12px" }}>
        <div className="section-label" style={{ padding:0, marginBottom:10 }}>Live Matchday</div>
        <div className="matchday-card">
          <div className="matchday-header">
            <div className="matchday-label">⚽ Matchday 3 — Group Stage</div>
            <div className="matchday-live">● LIVE</div>
          </div>
          <div className="fixtures">
            {fixtures.map((f,i) => (
              <div className="fixture" key={i}>
                <div className="fixture-team">{f.home}</div>
                <div style={{ textAlign:"center" }}>
                  <div className="fixture-score">{f.score}</div>
                  {f.live && <div className="fixture-time">LIVE</div>}
                </div>
                <div className="fixture-team right">{f.away}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Squad strip */}
      <div className="section-label">My Starting XI</div>
      <div className="squad-strip">
        {mySquad.map((p,i) => (
          <div className="player-chip" key={i}>
            <div className={`player-avatar${p.captain ? " captain":""}`}>{p.flag}</div>
            <div className="player-name">{p.name}</div>
            <div className="player-pts">{p.captain ? p.pts*2 : p.pts}pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SquadScreen() {
  const gks  = mySquad.filter(p => p.pos==="GK");
  const defs = mySquad.filter(p => p.pos==="DEF");
  const mids = mySquad.filter(p => p.pos==="MID");
  const fwds = mySquad.filter(p => p.pos==="FWD");
  const budget = (100 - ([...mySquad,...bench].length * 7.2)).toFixed(1);

  const PitchPlayer = ({ p }) => (
    <div className="pitch-player">
      <div className={`pitch-avatar${p.captain?" captain-mark":""}`}>{p.flag}</div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <span className={`pos-badge pos-${p.pos}`}>{p.pos}</span>
      </div>
      <div className="pitch-pname">{p.name}</div>
      <div className="pitch-ppts">{p.captain ? p.pts*2 : p.pts}pts</div>
    </div>
  );

  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop:28 }}>
        <div className="screen-title">MY <span>SQUAD</span></div>
        <div className="header-badge">15 / 15</div>
      </div>

      <div className="squad-info-row">
        <div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"var(--grey)", marginBottom:2 }}>Budget Left</div>
          <div className="squad-budget"><span>{budget}</span> OKB</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"var(--grey)", marginBottom:2 }}>Formation</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:20, fontWeight:700 }}>4 — 4 — 2</div>
        </div>
      </div>

      <div className="pitch">
        <div className="pitch-lines" />
        <div className="pitch-pos-label">FWD</div>
        <div className="pitch-row">{fwds.map((p,i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">MID</div>
        <div className="pitch-row">{mids.map((p,i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">DEF</div>
        <div className="pitch-row">{defs.map((p,i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">GK</div>
        <div className="pitch-row">{gks.map((p,i) => <PitchPlayer key={i} p={p} />)}</div>
      </div>

      <div className="bench-section">
        <div className="section-label" style={{ padding:0, marginBottom:10 }}>Bench</div>
        <div className="bench-row">
          {bench.map((p,i) => (
            <div className="player-chip" key={i}>
              <div className="player-avatar" style={{ opacity:0.6 }}>{p.flag}</div>
              <div className="player-name">{p.name}</div>
              <div style={{ display:"flex", justifyContent:"center" }}>
                <span className={`pos-badge pos-${p.pos}`}>{p.pos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wildcard-card">
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--accent)", marginBottom:3 }}>🃏 World Cup Wildcard</div>
          <div style={{ fontSize:11, color:"var(--grey)" }}>Reset full squad free after group stage</div>
        </div>
        <div className="wildcard-badge">AVAILABLE</div>
      </div>
    </div>
  );
}

function TransfersScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All","GK","DEF","MID","FWD"];
  const filtered = activeFilter === "All" ? allPlayers : allPlayers.filter(p => p.pos === activeFilter);

  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop:28 }}>
        <div className="screen-title">TRANS<span>FERS</span></div>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:700, color:"var(--accent)" }}>1 FREE</div>
      </div>

      <div className="transfer-filters">
        {filters.map(f => (
          <div key={f} className={`filter-chip${activeFilter===f?" active":""}`} onClick={() => setActiveFilter(f)}>{f}</div>
        ))}
      </div>

      <div className="player-list">
        {filtered.map((p,i) => (
          <div className="player-row" key={i}>
            <div className="player-row-avatar">{p.flag}</div>
            <div className="player-row-info">
              <div className="player-row-name">{p.name}</div>
              <div className="player-row-meta">
                <span className={`pos-badge pos-${p.pos}`}>{p.pos}</span>
                <span>{p.nat}</span>
                <div className={`form-dot ${p.form}`} />
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div className="player-row-price">{p.price}m</div>
              <div style={{ fontSize:11, color:"var(--gold)", fontWeight:600 }}>{p.pts}pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  const top3 = leaderboard.slice(0,3);
  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop:28 }}>
        <div className="screen-title">LEADER<span>BOARD</span></div>
        <div className="header-badge">MD 3</div>
      </div>

      <div className="lb-top3">
        <div className="lb-podium second">
          <div className="lb-podium-avatar" style={{ width:52,height:52 }}>{top3[1].flag}</div>
          <div className="lb-rank-badge">#2</div>
          <div className="lb-podium-name">{top3[1].name}</div>
          <div className="lb-podium-pts">{top3[1].pts}</div>
        </div>
        <div className="lb-podium first">
          <div className="lb-podium-avatar">{top3[0].flag}</div>
          <div className="lb-rank-badge" style={{ fontSize:28 }}>#1</div>
          <div className="lb-podium-name">{top3[0].name}</div>
          <div className="lb-podium-pts">{top3[0].pts}</div>
        </div>
        <div className="lb-podium third">
          <div className="lb-podium-avatar" style={{ width:52,height:52 }}>{top3[2].flag}</div>
          <div className="lb-rank-badge">#3</div>
          <div className="lb-podium-name">{top3[2].name}</div>
          <div className="lb-podium-pts">{top3[2].pts}</div>
        </div>
      </div>

      <div className="divider-line" />

      <div className="lb-list">
        {leaderboard.map((m,i) => (
          <div className={`lb-row${m.me?" me":""}`} key={i}>
            <div className="lb-pos">{i+1}</div>
            <div className="lb-avatar">{m.flag}</div>
            <div className="lb-name">{m.name}</div>
            <div style={{ textAlign:"right" }}>
              <div className="lb-pts">{m.pts}</div>
              <div className="lb-delta">{m.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FLOW SCREENS ── */

function VideoSplash({ onDone }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(onDone, 55000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position:"fixed", inset:0, zIndex:999,
        background:"#000", overflow:"hidden", cursor:"pointer",
      }}
      onClick={onDone}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        src="/ed19dd204b248c32c2992d1c77faaf95.mp4"
        onEnded={onDone}
        onError={() => setTimeout(onDone, 500)}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
      />
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
        zIndex:1, pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", bottom:52, left:"50%",
        transform:"translateX(-50%)",
        zIndex:2, display:"flex", flexDirection:"column",
        alignItems:"center", gap:10, pointerEvents:"none",
      }}>
        <div style={{
          fontSize:11, fontWeight:600, letterSpacing:3,
          textTransform:"uppercase", color:"rgba(255,255,255,0.5)",
        }}>Tap anywhere to skip</div>
        <div style={{ width:120, height:2, background:"rgba(255,255,255,0.12)", borderRadius:99, overflow:"hidden" }}>
          <div style={{
            height:"100%", background:"var(--accent)", borderRadius:99,
            animation:"splashProgress 49s linear forwards",
          }} />
        </div>
      </div>
      <style>{\`@keyframes splashProgress { from{width:0%} to{width:100%} }\`}</style>
    </div>
  );
}

function ConnectScreen({ onConnect }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Wire OKX Wallet SDK:
    // const provider = window.okxwallet
    // const accounts = await provider.request({ method: "eth_requestAccounts" })
    // onConnect(accounts[0])
    setTimeout(() => { setLoading(false); onConnect("0x4f2a...e91b"); }, 1200);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:998,
      background:"var(--bg)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:32,
    }}>
      <Logo size={76} sub={true} />

      <div style={{ fontSize:52, margin:"48px 0", filter:"drop-shadow(0 0 24px rgba(0,232,122,0.2))" }}>🏆</div>

      <div style={{ width:"100%", maxWidth:320 }}>
        <button className="btn-accent" onClick={handleConnect} style={{ opacity: loading ? 0.7:1 }}>
          {loading ? "Connecting..." : "Connect OKX Wallet"}
        </button>
        <div style={{ marginTop:14, textAlign:"center", fontSize:11, color:"var(--grey)", lineHeight:1.7 }}>
          Your wallet address is your identity.<br />No email. No password.
        </div>
      </div>

      <div style={{
        position:"absolute", bottom:32,
        fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"var(--grey2)",
      }}>
        Built on <span style={{ color:"var(--accent)" }}>X Layer</span>
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
    // Wire Supabase:
    // const { error } = await supabase.from("managers").insert({
    //   wallet, username: username.toLowerCase(),
    //   created_at: new Date().toISOString(), okb_balance: 100,
    // })
    // if (error?.code === "23505") { setError("Username taken. Try another."); setSaving(false); return; }
    setTimeout(() => { setSaving(false); onDone(username); }, 1000);
  };

  const rules = [
    ["3–20 characters", username.length >= 3 && username.length <= 20],
    ["Letters, numbers, underscores only", /^[a-zA-Z0-9_]*$/.test(username)],
    ["Stored permanently onchain", true],
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:997,
      background:"var(--bg)",
      display:"flex", flexDirection:"column",
      padding:"60px 28px 40px",
      overflowY:"auto",
    }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:4, textTransform:"uppercase", color:"var(--accent)", marginBottom:12 }}>
        One Time Setup
      </div>
      <div style={{
        fontFamily:"'Bebas Neue', sans-serif",
        fontSize:44, letterSpacing:2, lineHeight:1, marginBottom:12,
      }}>
        PICK YOUR<br /><span style={{ color:"var(--accent)" }}>MANAGER NAME</span>
      </div>
      <div style={{ fontSize:14, color:"var(--grey)", lineHeight:1.7, marginBottom:32 }}>
        This is permanent. Stored with every squad you submit. You will never be asked again.
      </div>

      <input
        type="text"
        value={username}
        onChange={e => { setError(""); setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,"")); }}
        placeholder="e.g. ElKing_XI"
        maxLength={20}
        style={{
          width:"100%", background:"var(--surface)",
          border:`1px solid ${isValid ? "var(--accent)" : "var(--border)"}`,
          borderRadius:6, padding:"16px 18px",
          fontSize:20, fontWeight:700, color:"var(--white)",
          outline:"none", fontFamily:"'Barlow Condensed', sans-serif",
          letterSpacing:1, marginBottom:8,
        }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:20, color: error ? "var(--red)":"var(--grey)" }}>
        <span>{error || "Letters, numbers, underscores"}</span>
        <span>{username.length}/20</span>
      </div>

      <div style={{
        background:"var(--surface)", border:"1px solid var(--border)",
        borderRadius:8, padding:"14px 16px",
        display:"flex", flexDirection:"column", gap:8, marginBottom:36,
      }}>
        {rules.map(([rule, ok]) => (
          <div key={rule} style={{
            display:"flex", alignItems:"center", gap:10,
            fontSize:12, color: ok && username.length > 0 ? "var(--accent)":"var(--grey)",
          }}>
            <span>{ok && username.length > 0 ? "✓" : "○"}</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>

      <button
        className="btn-accent"
        onClick={handleSave}
        style={{ opacity: (!isValid || saving) ? 0.4:1 }}
        disabled={!isValid || saving}
      >
        {saving ? "Saving..." : "Confirm Manager Name"}
      </button>
      <div style={{ marginTop:14, textAlign:"center", fontSize:11, color:"var(--grey)" }}>
        Wallet: {wallet}
      </div>
    </div>
  );
}

/* ── APP ROOT ── */
const TABS = [
  { id:"home",        label:"Home",      icon:"🏠" },
  { id:"squad",       label:"Squad",     icon:"⚽" },
  { id:"transfers",   label:"Transfers", icon:"🔄" },
  { id:"leaderboard", label:"Ranks",     icon:"🏆" },
];

const checkExistingUser = async (address) => {
  // const { data } = await supabase.from("managers").select("username").eq("wallet", address).single()
  // return data?.username || null
  return null;
};

export default function WorldXIApp() {
  const [phase, setPhase] = useState("video");
  const [activeTab, setActiveTab] = useState("home");
  const [wallet, setWallet] = useState(null);
  const [username, setUsername] = useState(null);
  const [muted, setMuted] = useState(false);
  const bgMusicRef = useRef(null);

  // Start Waka Waka when video ends or is skipped
  const startBgMusic = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.35;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  const handleVideoDone = () => {
    setPhase("connect");
    startBgMusic();
  };

  const handleConnect = async (address) => {
    setWallet(address);
    const existing = await checkExistingUser(address);
    if (existing) { setUsername(existing); setPhase("app"); }
    else { setPhase("username"); }
  };

  const toggleMute = () => {
    setMuted(m => {
      if (bgMusicRef.current) bgMusicRef.current.muted = !m;
      return !m;
    });
  };

  const screens = {
    home:        <HomeScreen username={username} />,
    squad:       <SquadScreen />,
    transfers:   <TransfersScreen />,
    leaderboard: <LeaderboardScreen />,
  };

  return (
    <>
      <style>{css}</style>

      {/* Waka Waka — loads silently, plays after video */}
      <audio
        ref={bgMusicRef}
        src="/Shakira - Waka Waka (This Time for Africa) (The Official 2010 FIFA World Cup™ Song).mp3"
        loop
        preload="auto"
      />

      {phase === "video" && <VideoSplash onDone={handleVideoDone} />}
      {phase === "connect" && <ConnectScreen onConnect={handleConnect} />}
      {phase === "username" && <SetUsernameScreen wallet={wallet} onDone={(name) => { setUsername(name); setPhase("app"); }} />}

      {phase === "app" && (
        <div className="app">
          <div className="screen">{screens[activeTab]}</div>
          <nav className="tab-bar">
            {TABS.map(t => (
              <div key={t.id} className={`tab${activeTab===t.id?" active":""}`} onClick={() => setActiveTab(t.id)}>
                <div className="tab-pip" />
                <div className="tab-icon">{t.icon}</div>
                <div className="tab-label">{t.label}</div>
              </div>
            ))}
            {/* Mute toggle */}
            <div
              style={{
                position:"absolute", top:-36, right:16,
                fontSize:18, cursor:"pointer", opacity:0.6,
                background:"var(--surface2)", borderRadius:"50%",
                width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
                border:"1px solid var(--border)",
              }}
              onClick={toggleMute}
            >
              {muted ? "🔇" : "🔊"}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
