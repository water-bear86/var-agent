"use client";

import type { ProbabilityPoint } from "../../lib/types";

type ProbabilityChartProps = {
  points: ProbabilityPoint[];
  activeIndex: number;
};

const width = 760;
const height = 260;
const plot = { left: 42, right: 26, top: 24, bottom: 34 };

export function ProbabilityChart({
  points,
  activeIndex,
}: ProbabilityChartProps) {
  const visible = points.slice(0, activeIndex + 1);
  const x = (index: number) =>
    plot.left +
    (index / Math.max(points.length - 1, 1)) *
      (width - plot.left - plot.right);
  const y = (value: number) =>
    plot.top +
    ((100 - value) / 100) * (height - plot.top - plot.bottom);
  const polyline = (key: "home" | "draw" | "away") =>
    visible.map((point, index) => `${x(index)},${y(point[key])}`).join(" ");
  const shockIndex = points.findIndex((point) => point.suspended);
  const shockVisible = activeIndex >= shockIndex;

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Home, draw, and away probability over the replay timeline"
    >
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line
            className="chart-grid"
            x1={plot.left}
            x2={width - plot.right}
            y1={y(tick)}
            y2={y(tick)}
          />
          <text
            className="chart-axis-label"
            x={plot.left - 10}
            y={y(tick) + 3}
            textAnchor="end"
          >
            {tick}
          </text>
        </g>
      ))}

      <polyline className="chart-line-home" points={polyline("home")} />
      <polyline className="chart-line-draw" points={polyline("draw")} />
      <polyline className="chart-line-away" points={polyline("away")} />

      {shockVisible ? (
        <g>
          <line
            className="shock-line"
            x1={x(shockIndex)}
            x2={x(shockIndex)}
            y1={plot.top}
            y2={height - plot.bottom}
          />
          <circle
            className="shock-dot"
            cx={x(shockIndex)}
            cy={y(points[shockIndex].home)}
            r="5"
          />
          <rect
            x={x(shockIndex) - 57}
            y={7}
            width="114"
            height="22"
            rx="2"
            fill="#071014"
            stroke="#ff554d"
          />
          <text
            className="shock-label"
            x={x(shockIndex)}
            y={22}
            textAnchor="middle"
          >
            SHOCK DETECTED
          </text>
        </g>
      ) : null}

      {points.map((point, index) => {
        if (index % 2 !== 0 && index !== shockIndex) return null;
        return (
          <text
            className={`chart-tick ${index === activeIndex ? "active" : ""}`}
            key={point.label}
            x={x(index)}
            y={height - 9}
            textAnchor="middle"
          >
            {point.label}
          </text>
        );
      })}
    </svg>
  );
}
