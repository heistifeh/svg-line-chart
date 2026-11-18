import { LineChart } from "./LineChart";

const data = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 180 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 240 },
  { label: "May", value: 210 },
  { label: "Jun", value: 320 },
  { label: "Jul", value: 290 },
];

export default function App() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22 }}>Monthly orders</h1>
      <p style={{ color: "#6b7280" }}>Hand-built SVG line chart. Hover or touch to inspect a point.</p>
      <LineChart data={data} title="Monthly orders, January to July" />
    </main>
  );
}
