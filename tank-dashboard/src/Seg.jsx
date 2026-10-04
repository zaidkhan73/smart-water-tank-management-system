// src/Seg.jsx — segmented control with a sliding highlight
export default function Seg({ items, value, onChange }) {
  const i = Math.max(0, items.findIndex(([id]) => id === value));
  return (
    <div className="seg" style={{ "--n": items.length, "--i": i }} role="tablist">
      <span className="seg-ind" />
      {items.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={id === value} className={id === value ? "on" : ""} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
