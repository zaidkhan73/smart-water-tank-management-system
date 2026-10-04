// src/home/Home.jsx — overview of every module
import { MODULES } from "../modules/registry";

export default function Home({ onOpen }) {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Society overview</h1>
          <p className="muted">Water, parking and waste at a glance.</p>
        </div>
      </header>
      <div className="cards">
        {MODULES.map((m) => (
          <button key={m.id} className="panel mod-card" onClick={() => onOpen(m.id)}>
            <div className="mod-title"><span aria-hidden>{m.icon}</span> {m.name}</div>
            <m.Card />
            <div className="muted small">{m.blurb}</div>
          </button>
        ))}
      </div>
    </>
  );
}
