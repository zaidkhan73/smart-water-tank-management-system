// src/App.jsx — login gate, top bar, bottom nav (mobile) / side nav (desktop)
import { useEffect, useState } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import { MODULES } from "./modules/registry";
import { HomeIcon, LogoutIcon, GoogleG } from "./icons";
import Home from "./home/Home";
import Seg from "./Seg";
import { useTheme } from "./useTheme";
import "./App.css";

const readTab = () => window.location.hash.slice(1) || "home";

// Apartment skyline for the login screen. Buildings rise, then windows light up one by one.
const BUILDINGS = [
  { x: 6, w: 56, h: 112 }, { x: 70, w: 48, h: 152 }, { x: 126, w: 64, h: 92 },
  { x: 198, w: 50, h: 172 }, { x: 256, w: 60, h: 122 }, { x: 324, w: 70, h: 142 },
];

function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" aria-hidden>
      {BUILDINGS.map((b, i) => {
        const cols = Math.floor((b.w - 8) / 14);
        const rows = Math.floor((b.h - 14) / 20);
        const left = b.x + (b.w - (cols * 14 - 6)) / 2;
        const top = 200 - b.h + 14;
        const wins = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const lit = (i + c * 2 + r * 3) % 3 !== 0;
            const delay = 1 + ((i * 3 + c * 5 + r * 7) % 12) * 0.18;
            wins.push(
              <rect key={`${r}-${c}`} x={left + c * 14} y={top + r * 20} width="8" height="11" rx="1.5"
                className={lit ? "win lit" : "win"} style={lit ? { animationDelay: `${delay}s` } : undefined} />
            );
          }
        }
        return (
          <g key={i} className="bld" style={{ animationDelay: `${i * 0.12}s` }}>
            <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} rx="3" className={`bld-body t${i % 2}`} />
            {wins}
          </g>
        );
      })}
    </svg>
  );
}

function Login() {
  const { login, error } = useAuth();
  return (
    <main className="login">
      <div className="login-copy">
        <h1>Smart Society</h1>
        <p className="muted">Water, parking and waste for your community, in one place.</p>
        <button className="google" onClick={login}><GoogleG /> Continue with Google</button>
        {error && <p className="err">{error}</p>}
      </div>
      <Skyline />
    </main>
  );
}

function Shell() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(readTab);
  const [menu, setMenu] = useState(false);
    const [theme, setTheme] = useTheme();

  useEffect(() => {
    const on = () => setTab(readTab());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  if (user === undefined) return <div className="login"><p className="muted">Loading…</p></div>;
  if (!user) return <Login />;

  const open = (id) => window.location.assign(`#${id}`);
  const nav = [{ id: "home", name: "Home", Icon: HomeIcon }, ...MODULES];
  const idx = Math.max(0, nav.findIndex((n) => n.id === tab));
  const current = MODULES.find((m) => m.id === tab);
  const initial = (user.displayName || user.email || "?")[0].toUpperCase();

  return (
    <div className="shell">
      <header className="top">
        <span className="brand">Smart Society</span>
        <button className="avatar" onClick={() => setMenu((o) => !o)} aria-label="Account menu" aria-expanded={menu}>
          {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : initial}
        </button>
        {menu && (
          <>
            <button className="backdrop" onClick={() => setMenu(false)} aria-label="Close menu" />
            <div className="menu">
              <div className="small muted">{user.email}</div>
                            <Seg value={theme} onChange={setTheme} items={[["system", "Auto"], ["light", "Light"], ["dark", "Dark"]]} />
              <button className="menu-item" onClick={logout}><LogoutIcon width="18" height="18" /> Sign out</button>
            </div>
          </>
        )}
      </header>

      <nav className="nav" style={{ "--n": nav.length, "--i": idx }} aria-label="Modules">
        <span className="nav-ind" />
        {nav.map((m) => (
          <button key={m.id} className={`nav-btn ${idx === nav.indexOf(m) ? "on" : ""}`} onClick={() => open(m.id)}>
            <m.Icon /><span>{m.name}</span>
          </button>
        ))}
      </nav>

      <main className="content">
        <div className="view" key={tab}>
          {current ? <current.Tab /> : <Home onOpen={open} />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
