'use client';

const getSourceColor = (source: string) => {
  const colors: { [key: string]: string } = {
    'Walk-In': 'text-orange-400',
    'Web': 'text-orange-300',
    'Website': 'text-orange-300',
    'Referral': 'text-orange-200',
    'Social Media': 'text-orange-100',
    'Email': 'text-orange-100',
    'Other': 'text-orange-50'
  };
  return colors[source] || 'text-orange-200';
};

export default function SourceChart({ data }: { data: { [key: string]: number } }) {
  const sources = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      color: getSourceColor(name)
    }))
    .sort((a, b) => b.count - a.count);

  if (sources.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-orange-200">No source data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div key={source.name} className="flex items-center justify-between py-3 border-b border-orange-800/30">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${source.color.replace('text', 'bg')}`}></div>
            <span className={`text-lg font-medium ${source.color}`}>
              {source.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-300 font-bold text-lg">
              {source.count}
            </span>
            <span className="text-orange-200 text-sm">
              ({Math.round((source.count / Object.values(data).reduce((a, b) => a + b, 0)) * 100)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}