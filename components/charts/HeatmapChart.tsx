'use client';

export default function HeatmapChart({ data }: { data: { [key: string]: number } }) {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const timeSlots = ['12-8', '8-4'];

  // Calculate max value for color intensity
  const maxValue = Math.max(...Object.values(data), 1);

  const getColorIntensity = (value: number) => {
    if (value === 0) return 'bg-gray-800';
    const percentage = value / maxValue;
    if (percentage > 0.75) return 'bg-orange-500';
    if (percentage > 0.5) return 'bg-orange-400';
    if (percentage > 0.25) return 'bg-orange-300';
    return 'bg-orange-200';
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <div className="w-16"></div>
        {days.map((day) => (
          <div key={day} className="flex-1 text-center text-orange-300 font-semibold text-sm">
            {day}
          </div>
        ))}
      </div>

      {timeSlots.map((timeSlot) => (
        <div key={timeSlot} className="flex items-center">
          <div className="w-16 text-orange-300 font-semibold text-sm">{timeSlot}</div>
          {days.map((day) => {
            const value = data[`${day}-${timeSlot}`] || 0;
            return (
              <div
                key={`${timeSlot}-${day}`}
                className={`flex-1 h-12 m-1 rounded-lg flex items-center justify-center ${getColorIntensity(value)} transition-all duration-300 hover:scale-105`}
              >
                <span className={`font-bold text-sm ${value > 0 ? 'text-black' : 'text-gray-600'}`}>
                  {value > 0 ? value : ''}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}