"use client";

import { useState } from "react";

export function Area({
  name,
  position,
  size,
  color = "red",
  dashArray = "8",
  rounded = "14px",
  debug = false,
  padding = 20,
  tooltip,
}: {
  name: string;
  position?: string;
  size?: string;
  color?: string;
  dashArray?: string;
  rounded?: string;
  debug?: boolean;
  padding?: number;
  tooltip?: string;
}) {
  const [showTooltip, setshowTooltip] = useState(false);

  return (
    <div
      className={`absolute flex items-center justify-center select-none ${position} ${size} ${
        debug ? "bg-red-500" : ""
      }`}
    >
      <svg
        className="absolute"
        width={`calc(100% + ${padding}px)`}
        height={`calc(100% + ${padding}px)`}
      >
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          strokeWidth="2px"
          stroke={color}
          strokeDasharray={dashArray}
          rx={rounded}
        />
      </svg>
      <div
        className="absolute flex items-center justify-center cursor-help"
        style={{
          top: `-${padding + 4}px`,
          height: `${padding}px`,
        }}
        onMouseEnter={() => setshowTooltip(true)}
        onMouseLeave={() => setshowTooltip(false)}
      >
        <p
          // Gradient background - transparent color transparent
          style={{
            color,
            background:
              "linear-gradient(90deg, transparent 0%, #1A171F 10%, #1A171F 90%, transparent 100%)",
          }}
          className="absolute flex items-center justify-center font-bold text-lg px-8 whitespace-nowrap"
        >
          {name}
        </p>

        {tooltip && (
          <p
            className={`absolute pointer-events-none -top-10 left-0 right-0 flex items-center justify-center transition-all duration-200 ${
              showTooltip ? "opacity-1" : "opacity-0 translate-y-2"
            }`}
          >
            <span
              style={{ backgroundColor: color }}
              className="rounded-lg text-black whitespace-nowrap text-center py-1 px-2"
            >
              {tooltip}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
