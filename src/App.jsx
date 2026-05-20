import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

:root {
  --bg:        #080b0f;
  --surface:   #0f1318;
  --surface2:  #161b22;
  --border:    rgba(255,255,255,0.07);
  --gold:      #F5C518;
  --gold-dim:  rgba(245,197,24,0.12);
  --green:     #00D68F;
  --green-dim: rgba(0,214,143,0.1);
  --red:       #FF4757;
  --white:     #FFFFFF;
  --grey:      rgba(255,255,255,0.45);
  --grey2:     rgba(255,255,255,0.2);
  --tab-h:     64px;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--white);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── APP SHELL ── */
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── SCREENS ── */
.screen {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: var(--tab-h);
  scrollbar-width: none;
}
.screen::-webkit-scrollbar { display: none; }

/* screen transitions */
.screen-enter { animation: screenIn 0.22s ease forwards; }
@keyframes screenIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── SPLASH ── */
.splash {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}
.splash video {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.5;
}
.splash-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #000 10%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.6) 100%);
}
.splash-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.splash-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 72px;
  letter-spacing: 8px;
  line-height: 1;
  color: var(--white);
}
.splash-logo span { color: var(--gold); }
.splash-tagline {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--grey);
}
.splash-bar {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  border-radius: 99px;
  overflow: hidden;
  z-index: 2;
}
.splash-bar-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 99px;
  animation: loadBar 2.2s ease forwards;
}
@keyframes loadBar {
  from { width: 0%; }
  to   { width: 100%; }
}

/* ── ONBOARDING ── */
.onboard {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}
.onboard-video-half {
  position: relative;
  height: 45vh;
  overflow: hidden;
  flex-shrink: 0;
}
.onboard-video-half video {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.6;
}
.onboard-video-half::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,11,15,0.3) 0%, var(--bg) 100%);
}
.onboard-body {
  flex: 1;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
}
.onboard-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
}
.onboard-dot {
  width: 5px; height: 5px;
  background: var(--gold);
  border-radius: 50%;
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.onboard-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 52px;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 16px;
}
.onboard-title em { font-style: normal; color: var(--gold); }
.onboard-desc {
  font-size: 14px;
  color: var(--grey);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 340px;
}
.onboard-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.pill {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 99px;
  color: var(--grey);
  background: var(--surface);
}
.pill.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

.btn-gold {
  width: 100%;
  padding: 16px;
  background: var(--gold);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: opacity 0.15s;
}
.btn-gold:active { opacity: 0.85; }
.btn-ghost {
  width: 100%;
  padding: 16px;
  background: transparent;
  color: var(--grey);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.btn-ghost:active { border-color: var(--grey); }

/* ── BOTTOM TAB BAR ── */
.tab-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: var(--tab-h);
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
  transition: opacity 0.15s;
}
.tab:active { opacity: 0.7; }
.tab-icon { font-size: 20px; line-height: 1; }
.tab-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--grey2);
  transition: color 0.15s;
}
.tab.active .tab-label { color: var(--gold); }
.tab-pip {
  position: absolute;
  top: 6px;
  width: 24px; height: 2px;
  background: var(--gold);
  border-radius: 99px;
  opacity: 0;
  transition: opacity 0.15s;
}
.tab.active .tab-pip { opacity: 1; }

/* ── SCREEN HEADER ── */
.screen-header {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.screen-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  letter-spacing: 2px;
}
.screen-title span { color: var(--gold); }
.header-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  background: var(--gold-dim);
  border: 1px solid rgba(245,197,24,0.25);
  padding: 5px 12px;
  border-radius: 3px;
}

/* ── HOME SCREEN ── */
.home-matchday {
  margin: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.matchday-header {
  background: var(--gold);
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.matchday-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000;
}
.matchday-countdown {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,0.6);
  letter-spacing: 1px;
}
.matchday-body { padding: 16px; }
.matchday-fixtures { display: flex; flex-direction: column; gap: 10px; }
.fixture {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--surface2);
  border-radius: 6px;
  border: 1px solid var(--border);
}
.fixture-team {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}
.fixture-team.right { text-align: right; }
.fixture-score {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--gold);
  padding: 0 16px;
  min-width: 64px;
  text-align: center;
}
.fixture-time {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--green);
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0 20px 20px;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
}
.stat-card-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 36px;
  line-height: 1;
  color: var(--gold);
}
.stat-card-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--grey);
  margin-top: 4px;
}

/* My squad preview */
.section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--grey);
  padding: 0 20px;
  margin-bottom: 12px;
}
.squad-preview {
  display: flex;
  gap: 10px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 20px;
}
.squad-preview::-webkit-scrollbar { display: none; }
.player-chip {
  flex-shrink: 0;
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.player-avatar {
  width: 56px; height: 56px;
  background: var(--surface2);
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  position: relative;
}
.player-avatar.captain::after {
  content: 'C';
  position: absolute;
  top: -4px; right: -4px;
  width: 18px; height: 18px;
  background: var(--gold);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--white);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.player-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--gold);
}
.pos-badge {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 2px 6px;
  border-radius: 2px;
}
.pos-GK { background: rgba(245,197,24,0.2); color: var(--gold); }
.pos-DEF { background: rgba(0,214,143,0.15); color: var(--green); }
.pos-MID { background: rgba(100,149,237,0.15); color: #6495ED; }
.pos-FWD { background: rgba(255,71,87,0.15); color: var(--red); }

/* Rank card */
.rank-card {
  margin: 0 20px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.rank-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  line-height: 1;
  color: var(--gold);
  min-width: 60px;
}
.rank-info { flex: 1; }
.rank-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--grey);
  margin-bottom: 4px;
}
.rank-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
}
.rank-pts span { color: var(--grey); font-size: 14px; font-weight: 400; }
.rank-delta {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--green);
}

/* ── SQUAD SCREEN ── */
.pitch {
  position: relative;
  margin: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  padding: 20px 0;
}
.pitch-lines {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px);
}
.pitch-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.pitch-pos-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--grey2);
  text-align: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}
.pitch-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 64px;
}
.pitch-avatar {
  width: 48px; height: 48px;
  background: var(--surface2);
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
  cursor: pointer;
  transition: border-color 0.15s;
}
.pitch-avatar:active { border-color: var(--gold); }
.pitch-avatar.empty {
  border-style: dashed;
  opacity: 0.4;
}
.pitch-avatar.captain-mark::after {
  content: 'C';
  position: absolute;
  top: -3px; right: -3px;
  width: 16px; height: 16px;
  background: var(--gold);
  color: #000;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pitch-pname {
  font-size: 9px;
  font-weight: 600;
  color: var(--white);
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pitch-ppts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--gold);
}

.squad-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.squad-budget {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 700;
}
.squad-budget span { color: var(--gold); }
.squad-count { font-size: 12px; color: var(--grey); }

.bench-section { padding: 0 20px 20px; }
.bench-row {
  display: flex;
  gap: 10px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

/* ── TRANSFERS SCREEN ── */
.transfer-filters {
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.transfer-filters::-webkit-scrollbar { display: none; }
.filter-chip {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 7px 16px;
  border: 1px solid var(--border);
  border-radius: 99px;
  color: var(--grey);
  background: var(--surface);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.filter-chip.active {
  border-color: var(--gold);
  color: var(--gold);
  background: var(--gold-dim);
}
.player-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }
.player-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.player-row:active { border-color: var(--gold); }
.player-row-avatar {
  width: 44px; height: 44px;
  background: var(--surface2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.player-row-info { flex: 1 }
.player-row-name { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.player-row-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--grey);
}
.player-row-price {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
}
.form-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
}
.form-dot.good { background: var(--green); }
.form-dot.ok { background: var(--gold); }
.form-dot.bad { background: var(--red); }

/* ── LEADERBOARD SCREEN ── */
.lb-top3 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 24px 20px 20px;
}
.lb-podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.lb-podium-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid var(--border);
  background: var(--surface2);
}
.lb-podium.first .lb-podium-avatar {
  width: 64px; height: 64px;
  border-color: var(--gold);
  box-shadow: 0 0 20px rgba(245,197,24,0.3);
}
.lb-podium.second .lb-podium-avatar,
.lb-podium.third .lb-podium-avatar { width: 52px; height: 52px; }
.lb-podium-name { font-size: 11px; font-weight: 600; text-align: center; }
.lb-podium-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
}
.lb-rank-badge {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: var(--gold);
}
.lb-list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 8px; }
.lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.lb-row.me { border-color: rgba(245,197,24,0.4); background: var(--gold-dim); }
.lb-pos {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  color: var(--grey2);
  min-width: 28px;
}
.lb-row.me .lb-pos { color: var(--gold); }
.lb-avatar {
  width: 40px; height: 40px;
  background: var(--surface2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.lb-name { flex: 1; font-size: 14px; font-weight: 600; }
.lb-pts {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--gold);
}
.lb-delta { font-size: 11px; color: var(--green); font-weight: 600; }

/* ── UTILITY ── */
.divider-line {
  height: 1px;
  background: var(--border);
  margin: 0 20px 20px;
}
`;

/* ─── MOCK DATA ─────────────────────────────────────────────── */
const mySquad = [
  { name: "Courtois",  pos: "GK",  pts: 8,  flag: "🇧🇪", captain: false },
  { name: "Cancelo",   pos: "DEF", pts: 9,  flag: "🇵🇹", captain: false },
  { name: "Rüdiger",   pos: "DEF", pts: 6,  flag: "🇩🇪", captain: false },
  { name: "Dias",      pos: "DEF", pts: 11, flag: "🇵🇹", captain: false },
  { name: "Theo H.",   pos: "DEF", pts: 7,  flag: "🇫🇷", captain: false },
  { name: "Bellingham",pos: "MID", pts: 14, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: false },
  { name: "De Bruyne", pos: "MID", pts: 12, flag: "🇧🇪", captain: false },
  { name: "Pedri",     pos: "MID", pts: 9,  flag: "🇪🇸", captain: false },
  { name: "Vinicius",  pos: "MID", pts: 10, flag: "🇧🇷", captain: false },
  { name: "Mbappe",    pos: "FWD", pts: 18, flag: "🇫🇷", captain: true  },
  { name: "Haaland",   pos: "FWD", pts: 15, flag: "🇳🇴", captain: false },
];

const bench = [
  { name: "Sommer",   pos: "GK",  pts: 2,  flag: "🇨🇭" },
  { name: "Militão",  pos: "DEF", pts: 4,  flag: "🇧🇷" },
  { name: "Nkunku",   pos: "MID", pts: 5,  flag: "🇫🇷" },
  { name: "Osimhen",  pos: "FWD", pts: 6,  flag: "🇳🇬" },
];

const allPlayers = [
  { name: "Mbappe",    pos: "FWD", nat: "France",  price: 13.5, pts: 18, flag: "🇫🇷", form: "good" },
  { name: "Haaland",   pos: "FWD", nat: "Norway",  price: 13.0, pts: 15, flag: "🇳🇴", form: "good" },
  { name: "Vinicius",  pos: "MID", nat: "Brazil",  price: 12.0, pts: 10, flag: "🇧🇷", form: "good" },
  { name: "Bellingham",pos: "MID", nat: "England", price: 11.5, pts: 14, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", form: "good" },
  { name: "De Bruyne", pos: "MID", nat: "Belgium", price: 11.0, pts: 12, flag: "🇧🇪", form: "ok"   },
  { name: "Pedri",     pos: "MID", nat: "Spain",   price: 9.5,  pts: 9,  flag: "🇪🇸", form: "ok"   },
  { name: "Osimhen",   pos: "FWD", nat: "Nigeria", price: 9.0,  pts: 6,  flag: "🇳🇬", form: "bad"  },
  { name: "Dias",      pos: "DEF", nat: "Portugal",price: 7.5,  pts: 11, flag: "🇵🇹", form: "good" },
  { name: "Courtois",  pos: "GK",  nat: "Belgium", price: 7.0,  pts: 8,  flag: "🇧🇪", form: "ok"   },
  { name: "Cancelo",   pos: "DEF", nat: "Portugal",price: 7.0,  pts: 9,  flag: "🇵🇹", form: "ok"   },
];

const leaderboard = [
  { name: "ElKing",    pts: 412, delta: "+18", flag: "🇳🇬" },
  { name: "TacticoX",  pts: 398, delta: "+6",  flag: "🇧🇷" },
  { name: "PitchGod",  pts: 387, delta: "+11", flag: "🇬🇧" },
  { name: "You",       pts: 371, delta: "+14", flag: "🫵",  me: true },
  { name: "Alvarado",  pts: 364, delta: "+3",  flag: "🇪🇸" },
  { name: "NaijaBoss", pts: 358, delta: "+7",  flag: "🇳🇬" },
  { name: "FutbolFC",  pts: 341, delta: "-2",  flag: "🇩🇪" },
  { name: "GoldenXI",  pts: 329, delta: "+9",  flag: "🇫🇷" },
];

const fixtures = [
  { home: "🇫🇷 France",   away: "Brazil 🇧🇷",   score: "2 — 1", live: true  },
  { home: "🇩🇪 Germany",  away: "Spain 🇪🇸",    score: "14:00", live: false },
  { home: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England",  away: "Portugal 🇵🇹", score: "17:00", live: false },
];

/* ─── SCREENS ────────────────────────────────────────────────── */

function HomeScreen() {
  const totalPts = mySquad.reduce((a, p) => a + (p.captain ? p.pts * 2 : p.pts), 0);
  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop: 28 }}>
        <div className="screen-title">WORLD<span>XI</span></div>
        <div className="header-badge">MD 3 LIVE</div>
      </div>

      {/* Rank card */}
      <div style={{ padding: "16px 20px 0" }}>
        <div className="rank-card">
          <div className="rank-num">#4</div>
          <div className="rank-info">
            <div className="rank-label">Your Rank</div>
            <div className="rank-pts">{totalPts} <span>pts</span></div>
          </div>
          <div className="rank-delta">▲ 14</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "16px 20px 0" }}>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-num">11</div>
            <div className="stat-card-label">Players</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num" style={{ color: "var(--green)" }}>1</div>
            <div className="stat-card-label">Free Transfer</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-num" style={{ color: "var(--red)" }}>3</div>
            <div className="stat-card-label">Days Left</div>
          </div>
        </div>
      </div>

      {/* Live fixtures */}
      <div style={{ padding: "4px 20px 16px" }}>
        <div className="section-label" style={{ padding: 0, marginBottom: 12 }}>Live Matchday</div>
        <div className="home-matchday">
          <div className="matchday-header">
            <div className="matchday-label">⚽ Matchday 3 — Group Stage</div>
            <div className="matchday-countdown">LIVE</div>
          </div>
          <div className="matchday-body">
            <div className="matchday-fixtures">
              {fixtures.map((f, i) => (
                <div className="fixture" key={i}>
                  <div className="fixture-team">{f.home}</div>
                  <div style={{ textAlign: "center" }}>
                    <div className="fixture-score">{f.score}</div>
                    {f.live && <div className="fixture-time">LIVE</div>}
                  </div>
                  <div className="fixture-team right">{f.away}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My squad preview */}
      <div className="section-label">My Starting XI</div>
      <div className="squad-preview">
        {mySquad.map((p, i) => (
          <div className="player-chip" key={i}>
            <div className={`player-avatar${p.captain ? " captain" : ""}`}>
              {p.flag}
            </div>
            <div className="player-name">{p.name}</div>
            <div className="player-pts">{p.captain ? p.pts * 2 : p.pts}pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SquadScreen() {
  const gks  = mySquad.filter(p => p.pos === "GK");
  const defs = mySquad.filter(p => p.pos === "DEF");
  const mids = mySquad.filter(p => p.pos === "MID");
  const fwds = mySquad.filter(p => p.pos === "FWD");
  const spent = [...mySquad, ...bench].length * 7.2;
  const budget = (100 - spent).toFixed(1);

  const PitchPlayer = ({ p }) => (
    <div className="pitch-player">
      <div className={`pitch-avatar${p.captain ? " captain-mark" : ""}`}>{p.flag}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span className={`pos-badge pos-${p.pos}`}>{p.pos}</span>
      </div>
      <div className="pitch-pname">{p.name}</div>
      <div className="pitch-ppts">{p.captain ? p.pts * 2 : p.pts}pts</div>
    </div>
  );

  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop: 28 }}>
        <div className="screen-title">MY <span>SQUAD</span></div>
        <div className="header-badge">15 / 15</div>
      </div>

      {/* Budget bar */}
      <div className="squad-info-row">
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--grey)", marginBottom: 2 }}>Budget Left</div>
          <div className="squad-budget"><span>{budget}</span> OKB</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--grey)", marginBottom: 2 }}>Formation</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 20, fontWeight: 700 }}>4 — 4 — 2</div>
        </div>
      </div>

      {/* Pitch */}
      <div className="pitch">
        <div className="pitch-lines" />
        <div className="pitch-pos-label">FWD</div>
        <div className="pitch-row">{fwds.map((p, i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">MID</div>
        <div className="pitch-row">{mids.map((p, i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">DEF</div>
        <div className="pitch-row">{defs.map((p, i) => <PitchPlayer key={i} p={p} />)}</div>
        <div className="pitch-pos-label">GK</div>
        <div className="pitch-row">{gks.map((p, i) => <PitchPlayer key={i} p={p} />)}</div>
      </div>

      {/* Bench */}
      <div className="bench-section">
        <div className="section-label" style={{ padding: 0, marginBottom: 10 }}>Bench</div>
        <div className="bench-row">
          {bench.map((p, i) => (
            <div className="player-chip" key={i}>
              <div className="player-avatar" style={{ opacity: 0.65 }}>{p.flag}</div>
              <div className="player-name">{p.name}</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className={`pos-badge pos-${p.pos}`}>{p.pos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wildcard chip */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{
          background: "var(--surface)",
          border: "1px solid rgba(245,197,24,0.25)",
          borderRadius: 8,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginBottom: 3 }}>🃏 World Cup Wildcard</div>
            <div style={{ fontSize: 11, color: "var(--grey)" }}>Reset full squad free after group stage</div>
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed'", fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase",
            color: "var(--gold)", background: "var(--gold-dim)",
            border: "1px solid rgba(245,197,24,0.3)",
            padding: "6px 14px", borderRadius: 3
          }}>AVAILABLE</div>
        </div>
      </div>
    </div>
  );
}

function TransfersScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "GK", "DEF", "MID", "FWD"];
  const filtered = activeFilter === "All"
    ? allPlayers
    : allPlayers.filter(p => p.pos === activeFilter);

  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop: 28 }}>
        <div className="screen-title">TRANS<span>FERS</span></div>
        <div style={{
          fontFamily: "'Barlow Condensed'", fontSize: 16, fontWeight: 700,
          color: "var(--green)"
        }}>1 FREE</div>
      </div>

      {/* Filters */}
      <div className="transfer-filters">
        {filters.map(f => (
          <div
            key={f}
            className={`filter-chip${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >{f}</div>
        ))}
      </div>

      {/* Player list */}
      <div className="player-list">
        {filtered.map((p, i) => (
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
            <div style={{ textAlign: "right" }}>
              <div className="player-row-price">{p.price}m</div>
              <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600 }}>{p.pts}pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="screen screen-enter">
      <div className="screen-header" style={{ paddingTop: 28 }}>
        <div className="screen-title">LEADER<span>BOARD</span></div>
        <div className="header-badge">MD 3</div>
      </div>

      {/* Podium */}
      <div className="lb-top3">
        <div className="lb-podium second">
          <div className="lb-podium-avatar" style={{ width: 52, height: 52 }}>{top3[1].flag}</div>
          <div className="lb-rank-badge">#2</div>
          <div className="lb-podium-name">{top3[1].name}</div>
          <div className="lb-podium-pts">{top3[1].pts}</div>
        </div>
        <div className="lb-podium first">
          <div className="lb-podium-avatar">{top3[0].flag}</div>
          <div className="lb-rank-badge" style={{ fontSize: 28 }}>#1</div>
          <div className="lb-podium-name">{top3[0].name}</div>
          <div className="lb-podium-pts">{top3[0].pts}</div>
        </div>
        <div className="lb-podium third">
          <div className="lb-podium-avatar" style={{ width: 52, height: 52 }}>{top3[2].flag}</div>
          <div className="lb-rank-badge">#3</div>
          <div className="lb-podium-name">{top3[2].name}</div>
          <div className="lb-podium-pts">{top3[2].pts}</div>
        </div>
      </div>

      <div className="divider-line" />

      {/* Full list */}
      <div className="lb-list">
        {leaderboard.map((m, i) => (
          <div className={`lb-row${m.me ? " me" : ""}`} key={i}>
            <div className="lb-pos">{i + 1}</div>
            <div className="lb-avatar">{m.flag}</div>
            <div className="lb-name">{m.name}</div>
            <div style={{ textAlign: "right" }}>
              <div className="lb-pts">{m.pts}</div>
              <div className="lb-delta">{m.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SPLASH + ONBOARDING ───────────────────────────────────── */
function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="splash">
      <video autoPlay muted loop playsInline src="/worldcup-bg.mp4"
        onError={e => { e.target.style.display = "none"; }} />
      <div className="splash-overlay" />
      <div className="splash-content">
        <div className="splash-logo">WORLD<span>XI</span></div>
        <div className="splash-tagline">Onchain Fantasy Football</div>
      </div>
      <div className="splash-bar"><div className="splash-bar-fill" /></div>
    </div>
  );
}

function Onboarding({ onDone }) {
  return (
    <div className="onboard">
      <div className="onboard-video-half">
        <video autoPlay muted loop playsInline src="/worldcup-bg.mp4"
          onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div className="onboard-body">
        <div className="onboard-badge">
          <div className="onboard-dot" />
          World Cup 2026
        </div>
        <h1 className="onboard-title">
          PICK YOUR<br /><em>SQUAD.</em>
        </h1>
        <p className="onboard-desc">
          Build a 15-man squad from real World Cup players.
          Lock it onchain. Let the stats decide who wins.
        </p>
        <div className="onboard-pills">
          {["100 OKB Budget", "15 Players", "Captain ×2", "Wildcard Chip", "Mini-Leagues"].map(t => (
            <div className="pill active" key={t}>{t}</div>
          ))}
        </div>
        <button className="btn-gold" onClick={onDone}>Connect OKX Wallet</button>
        <button className="btn-ghost">Browse as Guest</button>
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────── */
const TABS = [
  { id: "home",        label: "Home",      icon: "🏠" },
  { id: "squad",       label: "Squad",     icon: "⚽" },
  { id: "transfers",   label: "Transfers", icon: "🔄" },
  { id: "leaderboard", label: "Ranks",     icon: "🏆" },
];

export default function WorldXIApp() {
  const [phase, setPhase] = useState("splash"); // splash | onboard | app
  const [activeTab, setActiveTab] = useState("home");

  const screens = {
    home:        <HomeScreen />,
    squad:       <SquadScreen />,
    transfers:   <TransfersScreen />,
    leaderboard: <LeaderboardScreen />,
  };

  return (
    <>
      <style>{css}</style>

      {phase === "splash" && (
        <Splash onDone={() => setPhase("onboard")} />
      )}

      {phase === "onboard" && (
        <Onboarding onDone={() => setPhase("app")} />
      )}

      {phase === "app" && (
        <div className="app">
          <div className="screen">
            {screens[activeTab]}
          </div>
          <nav className="tab-bar">
            {TABS.map(t => (
              <div
                key={t.id}
                className={`tab${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <div className="tab-pip" />
                <div className="tab-icon">{t.icon}</div>
                <div className="tab-label">{t.label}</div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
