// src/home/Home.jsx — overview: one row per module
import { MODULES } from "../modules/registry";
import { ChevronIcon } from "../icons";
import { useAuth } from "../auth/useAuth";
import { useNow } from "../useFirebase";

export default function Home({ onOpen }) {
  const { user } = useAuth();
  const hour = new Date(useNow(60000)).getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = (user?.displayName || "").split(" ")[0];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{first ? `${greet}, ${first}` : greet}</h1>
          <p className="muted">Your society right now.</p>
        </div>
      </header>
      <div className="group">
        {MODULES.map((m) => (
          <button key={m.id} className="row tap" onClick={() => onOpen(m.id)}>
            <span className="ico"><m.Icon /></span>
            <span className="row-main">
              <span className="row-title">{m.name}</span>
              <span className="row-sub">{m.blurb}</span>
            </span>
            <m.Card />
            <ChevronIcon className="chev" width="18" height="18" />
          </button>
        ))}
      </div>
    </>
  );
}
