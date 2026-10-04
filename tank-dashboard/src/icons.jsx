// src/icons.jsx — tiny inline icon set (no emoji, no extra dependency)
const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
};
function Svg({ children, ...props }) {
  return <svg {...base} {...props}>{children}</svg>;
}

export function HomeIcon(props) {
  return <Svg {...props}><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /></Svg>;
}
export function DropIcon(props) {
  return <Svg {...props}><path d="M12 3c3.6 4.3 6 7.3 6 10.2a6 6 0 0 1-12 0C6 10.3 8.4 7.3 12 3z" /></Svg>;
}
export function ParkingIcon(props) {
  return <Svg {...props}><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" /></Svg>;
}
export function BinIcon(props) {
  return <Svg {...props}><path d="M5 7h14" /><path d="M9 7V4h6v3" /><path d="M7 7l1 13h8l1-13" /></Svg>;
}
export function LogoutIcon(props) {
  return <Svg {...props}><path d="M10 4H5v16h5" /><path d="M15 8l4 4-4 4" /><path d="M19 12H9" /></Svg>;
}
export function ChevronIcon(props) {
  return <Svg {...props}><path d="M9 6l6 6-6 6" /></Svg>;
}

export function GoogleG(props) {
  return (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);
}
