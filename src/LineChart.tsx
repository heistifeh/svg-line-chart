import { useMemo, useRef, useState } from "react";
import {
  buildAreaPath,
  buildLinePath,
  nearestIndex,
  niceTicks,
  scaleLinear,
  type Point,
} from "./lib/chart";

type Props = {
  data: Point[];
  width?: number;
  height?: number;
  title: string;
};

const M = { top: 20, right: 20, bottom: 36, left: 48 };

export function LineChart({ data, width = 640, height = 320, title }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const geo = useMemo(() => {
    const innerW = width - M.left - M.right;
    const innerH = height - M.top - M.bottom;
    const values = data.map((d) => d.value);
    const ticks = niceTicks(Math.min(...values, 0), Math.max(...values), 5);
    const x = scaleLinear([0, Math.max(1, data.length - 1)], [M.left, M.left + innerW]);
    const y = scaleLinear([ticks[0], ticks[ticks.length - 1]], [M.top + innerH, M.top]);
    const pts = data.map((d, i) => [x(i), y(d.value)] as [number, number]);
    return { ticks, x, y, pts, baseY: M.top + innerH };
  }, [data, width, height]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    // Convert client coordinates to SVG user-space (viewBox) coordinates.
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    setActive(nearestIndex(geo.pts.map((p) => p[0]), px));
  }

  const a = active !== null && active >= 0 ? active : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={title}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      style={{ width: "100%", height: "auto", touchAction: "none" }}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {geo.ticks.map((t) => (
        <g key={t} data-testid="tick">
          <line
            x1={M.left}
            x2={width - M.right}
            y1={geo.y(t)}
            y2={geo.y(t)}
            stroke="#e5e7eb"
          />
          <text x={M.left - 8} y={geo.y(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#6b7280">
            {t}
          </text>
        </g>
      ))}

      {data.map((d, i) => (
        <text key={d.label} x={geo.pts[i][0]} y={height - 12} textAnchor="middle" fontSize="11" fill="#6b7280">
          {d.label}
        </text>
      ))}

      <path d={buildAreaPath(geo.pts, geo.baseY)} fill="url(#area)" />
      <path d={buildLinePath(geo.pts)} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {a !== null && (
        <g data-testid="active-point">
          <line x1={geo.pts[a][0]} x2={geo.pts[a][0]} y1={M.top} y2={geo.baseY} stroke="#9ca3af" strokeDasharray="4 4" />
          <circle cx={geo.pts[a][0]} cy={geo.pts[a][1]} r="5" fill="#fff" stroke="#4f46e5" strokeWidth="2.5" />
          <g transform={`translate(${Math.min(Math.max(geo.pts[a][0] - 44, M.left), width - M.right - 88)}, ${Math.max(geo.pts[a][1] - 46, 2)})`}>
            <rect width="88" height="34" rx="6" fill="#111827" />
            <text x="44" y="14" textAnchor="middle" fontSize="10" fill="#9ca3af">{data[a].label}</text>
            <text x="44" y="27" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">{data[a].value}</text>
          </g>
        </g>
      )}
    </svg>
  );
}
