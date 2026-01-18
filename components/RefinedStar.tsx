"use client";

interface RefinedStarProps {
  className?: string;
  filled?: boolean;
}

export function RefinedStar({ className = "", filled = true }: RefinedStarProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1}
      className={className}
      style={{
        filter: filled ? "drop-shadow(0 0 1.5px rgba(212, 175, 55, 0.5)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))" : "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))",
        opacity: filled ? 1 : 0.4,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Highly refined 5-point star - geometric precision with elegant proportions */}
      <path
        d="M12 2l2.244 6.728 7.064.572-5.356 4.544 1.592 6.856L12 17.272l-5.544 3.428 1.592-6.856L3.692 9.3l7.064-.572L12 2z"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      />
    </svg>
  );
}
