export default function LegendDot({
  color,
  size = 8,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}
