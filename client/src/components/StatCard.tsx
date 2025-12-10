interface StatCardProps {
  icon: React.ReactNode;
  title?: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  change?: string;
  color?: string;
}

export function StatCard({ 
  icon, 
  title, 
  value, 
  trend, 
  change, 
  color 
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`${color ? `text-${color}-500` : 'text-primary-500'} mb-3`}>
            {icon}
          </div>
          <p className="text-small text-neutral-700 mb-2">{title || ''}</p>
          <p className="text-h2 font-bold text-neutral-900" style={{ fontFeatureSettings: '"tnum"' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <p className="text-small text-neutral-600 mt-1">
              {change}
            </p>
          )}
          {trend && (
            <p className={`text-small mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}