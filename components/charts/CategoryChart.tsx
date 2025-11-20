'use client';

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Service': 'text-orange-400',
    'Parts': 'text-orange-300', 
    'Accessories': 'text-orange-200',
    'Consulting': 'text-orange-100',
    'Other': 'text-orange-50'
  };
  return colors[category] || 'text-orange-200';
};

export default function CategoryChart({ data }: { data: { [key: string]: number } }) {
  const categories = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.count - a.count);

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-orange-200">No category data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center justify-between py-3 border-b border-orange-800/30">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${category.color.replace('text', 'bg')}`}></div>
            <span className={`text-lg font-medium ${category.color}`}>
              {category.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-300 font-bold text-lg">
              {category.count}
            </span>
            <span className="text-orange-200 text-sm">
              ({Math.round((category.count / Object.values(data).reduce((a, b) => a + b, 0)) * 100)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}