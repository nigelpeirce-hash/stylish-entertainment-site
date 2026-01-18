"use client";

interface RefinedCheckmarkProps {
  className?: string;
}

export function RefinedCheckmark({ className = "" }: RefinedCheckmarkProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="miter"
      className={className}
      style={{
        filter: "drop-shadow(0 0 1.5px rgba(212, 175, 55, 0.4)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Refined checkmark with geometric precision */}
      <path
        d="M16.667 5L7.5 14.167l-4.167-4.167"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
