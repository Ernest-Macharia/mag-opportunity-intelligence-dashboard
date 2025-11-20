'use client';

const getScoreColor = (range: string) => {
  const colors: { [key: string]: string } = {
    '0-25': 'bg-red-500',
    '26-50': 'bg-orange-400',
    '51-75': 'bg-orange-300',
    '76-100': 'bg-green-500'
  };
  return colors[range] || 'bg-orange-200';
};

export default function ScoreDistribution({ data }: { data: { [key: string]: number } }) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  const scores = Object.entries(data)
    .map(([range, count]) => ({
      range,
      count,
      percentage: Math.round((count / total) * 100),
      color: getScoreColor(range),
      width: `${Math.round((count / total) * 100)}%`
    }))
    .sort((a, b) => parseInt(a.range.split('-')[0]) - parseInt(b.range.split('-')[0]));

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-orange-200">No score data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {scores.map((score, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-lg font-medium text-orange-300 w-20">{score.range}</span>
          <div className="flex-1 mx-4">
            <div className="bg-gray-700 rounded-full h-8 relative">
              <div 
                className={`h-8 rounded-full flex items-center justify-end pr-4 ${score.color} transition-all duration-500`}
                style={{ width: score.width }}
              >
                {score.percentage > 10 && (
                  <span className="text-sm font-semibold text-black">
                    {score.percentage}%
                  </span>
                )}
              </div>
              {score.percentage <= 10 && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-white">
                  {score.percentage}%
                </span>
              )}
            </div>
          </div>
          <span className="text-orange-200 text-sm w-12 text-right">
            {score.count}
          </span>
        </div>
      ))}
    </div>
  );
}