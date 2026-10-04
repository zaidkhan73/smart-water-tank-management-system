// src/modules/Placeholder.jsx — shown until a module's team plugs in their code.
// To integrate: build your own folder (src/modules/<name>/), then replace
// the entry in src/modules/registry.jsx.
export function PlaceholderTab({ name, expects }) {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>{name}</h1>
          <p className="muted">This module is not connected yet.</p>
        </div>
      </header>
      <section className="panel">
        <h2>What this tab needs from the {name.toLowerCase()} team</h2>
        <ul className="needs">
          {expects.map((e) => <li key={e}>{e}</li>)}
        </ul>
        <p className="muted small">
          Events should use the common shape <code>{`{ t, type, msg }`}</code> under <code>/{name.toLowerCase()}/events</code> so
          they show up in logs and email alerts without extra work.
        </p>
      </section>
    </>
  );
}

export function PlaceholderCard() {
  return (
    <>
      <div className="card-big muted">–</div>
      <div className="card-line muted">Not connected yet</div>
    </>
  );
}
