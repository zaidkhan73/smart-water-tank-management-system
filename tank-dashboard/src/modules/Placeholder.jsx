// src/modules/Placeholder.jsx — shown until a module's team plugs in their code.
// To integrate: build your own folder (src/modules/<name>/), then replace
// the entry in src/modules/registry.jsx.
export function PlaceholderTab({ name, expects }) {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>{name}</h1>
          <p className="muted">Not connected yet.</p>
        </div>
      </header>
      <section className="surface">
        <h2>What we need from the {name.toLowerCase()} team</h2>
        <ul className="needs">
          {expects.map((e) => <li key={e}>{e}</li>)}
        </ul>
        <p className="muted small">
          Events should look like <code>{`{ t, type, msg }`}</code> under <code>/{name.toLowerCase()}/events</code>, so
          they appear in logs and email alerts without extra work.
        </p>
      </section>
    </>
  );
}

export function PlaceholderCard() {
  return <span className="stat muted">Not connected</span>;
}
