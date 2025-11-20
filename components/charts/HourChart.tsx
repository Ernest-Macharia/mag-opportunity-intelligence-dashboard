'use client';

export default function HourChart({ data }: { data: number[] }) {
  const hourLabels = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];
  
  const maxValue = Math.max(...data, 1);

  return (
    <div className="flex items-end justify-between h-48 px-2">
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div className="text-orange-300 font-semibold text-sm">{value}</div>
          <div 
            className="w-8 bg-gradient-to-t from-orange-400 to-orange-600 rounded-t transition-all duration-300 hover:from-orange-300 hover:to-orange-500"
            style={{ height: `${(value / maxValue) * 120}px` }}
          />
          <div className="text-orange-200 text-xs">{hourLabels[index]}</div>
        </div>
      ))}
    </div>
  );
}