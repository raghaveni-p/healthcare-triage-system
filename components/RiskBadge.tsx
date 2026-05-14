interface RiskBadgeProps {
  level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[level as keyof typeof colors] || colors.medium
      }`}
    >
      {level.toUpperCase()} RISK
    </span>
  );
}
