import React from "react";

type Props = {
  level: number;
};

const StepBars: React.FC<Props> = ({ level }) => {
  const barHeights = [9, 17, 25];
  const barWidth = 5;
  const gap = 4;

  const getColor = (index: number): string => {
    if (level === 1) {
      return index === 0 ? "#00ff00" : "#ccc";
    } else if (level === 2) {
      return index <= 1 ? "#ffbb00" : "#ccc";
    } else {
      return "#f82222";
    }
  };

  return (
    <svg
      width={barWidth * 3 + gap * 2}
      height={barHeights[2]}
      role="img"
      aria-label={`Step level ${level}`}
    >
      {barHeights.map((height, i) => (
        <rect
          key={i}
          x={i * (barWidth + gap)}
          y={barHeights[2] - height}
          width={barWidth}
          height={height}
          fill={getColor(i)}
          rx={2}
          ry={2}
        />
      ))}
    </svg>
  );
};

export default StepBars;
