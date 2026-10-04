// src/App.jsx — login gate + sidebar tabs
import { useEffect, useState } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import { MODULES } from "./modules/registry";
import Home from "./home/Home";
import "./App.css";

const readTab = () => window.location.hash.slice(1) || "home";

function Login() {
  const { login, error } = useAuth();
  return (
    <main className="login">
      <div className="login-box">
        <h1>Smart Society</h1>
        <p className="muted">Water, parking and waste, in one place.</p>
        <button className="btn" onClick={login}>Sign in with Google</button>
        {error && <p className="err">{error}</p>}
      </div>
    </main>
  );
}

function Shell() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(readTab);

  useEffect(() => {
    const on = () => setTab(readTab());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  if (user === undefined) return <div className="login"><p className="muted">Loading…</p></div>;
  if (!user) return <Login />;

  const open = (id) => window.location.assign(`#${id}`);
  const current = MODULES.find((m) => m.id === tab);
  const nav = [{ id: "home", name: "Home", icon: "🏠" }, ...MODULES];

  return (
    <div className="shell">
      <nav className="side" aria-label="Modules">
        <div className="brand">Smart Society</div>
        {nav.map((m) => (
          <button key={m.id} className={`nav-btn ${tab === m.id || (!current && m.id === "home") ? "on" : ""}`} onClick={() => open(m.id)}>
            <span aria-hidden>{m.icon}</span><span>{m.name}</span>
          </button>
        ))}
        <div className="who">
          <span className="muted small">{user.email}</span>
          <button className="link" onClick={logout}>Sign out</button>
        </div>
      </nav>
      <main className="content">
        {current ? <current.Tab /> : <Home onOpen={open} />}
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
