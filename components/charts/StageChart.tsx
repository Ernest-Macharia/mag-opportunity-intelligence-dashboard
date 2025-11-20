'use client';

const getStageColor = (stage: string) => {
  const colors: { [key: string]: string } = {
    'New': 'text-orange-400',
    'Contact': 'text-orange-300',
    'Qualified': 'text-orange-200',
    'Proposal': 'text-orange-100',
    'Closed': 'text-green-400'
  };
  return colors[stage] || 'text-orange-200';
};

export default function StageChart({ data }: { data: { [key: string]: number } }) {
  const stages = Object.entries(data)
    .filter(([name, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      color: getStageColor(name)
    }))
    .sort((a, b) => b.count - a.count);

  if (stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-orange-200">No stage data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <div key={stage.name} className="flex items-center justify-between py-3 border-b border-orange-800/30">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${stage.color.replace('text', 'bg')}`}></div>
            <span className={`text-lg font-medium ${stage.color}`}>
              {stage.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-300 font-bold text-lg">
              {stage.count}
            </span>
            <span className="text-orange-200 text-sm">
              ({Math.round((stage.count / Object.values(data).reduce((a, b) => a + b, 0)) * 100)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}