'use client';
import { useState, useEffect } from 'react';
import { LogOut, RefreshCw, TrendingUp, Target, Zap, AlertCircle } from 'lucide-react';
import { DashboardProps, Opportunity, DashboardData } from '@/types';
import { apiClient } from '@/lib/api';

// Import chart components
import HeatmapChart from './charts/HeatmapChart';
import HourChart from './charts/HourChart';
import CategoryChart from './charts/CategoryChart';
import StageChart from './charts/StageChart';
import SourceChart from './charts/SourceChart';
import ScoreDistribution from './charts/ScoreDistribution';

// Demo data generator
const generateDemoData = (): Opportunity[] => {
  const types = ['individual', 'organization'];
  const sources = ['website', 'referral', 'walk_in', 'social_media', 'email', 'manual'];
  const statuses = ['new', 'contacted', 'qualified', 'proposal', 'closed'];
  
  const demoOpportunities = Array.from({ length: 48 }, (_, i) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    randomDate.setHours(8 + Math.floor(Math.random() * 9));
    
    return {
      _id: `demo-${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      subject: `Demo Opportunity ${i + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      customer: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+123456789${i}`,
        companyName: `Company ${i + 1}`,
        _id: `customer-${i + 1}`
      },
      vehicles: Math.random() > 0.3 ? [{
        _id: `vehicle-${i + 1}`,
        vin: `VIN${i + 1}`,
        registrationNumber: `REG${i + 1}`,
        make: 'Honda',
        model: 'Civic',
        year: 2020,
        color: 'Blue'
      }] : [],
      jobCards: Math.random() > 0.5 ? [{
        _id: `jobcard-${i + 1}`,
        jobTitle: 'Oil Change Service',
        status: 'pending'
      }] : [],
      waivers: [],
      quotes: Math.random() > 0.6 ? [{
        _id: `quote-${i + 1}`,
        quoteNumber: `Q-2024-${i + 1}`,
        totalAmount: 10000,
        status: 'pending'
      }] : [],
      assignedTo: null,
      createdAt: randomDate.toISOString(),
      updatedAt: randomDate.toISOString(),
      __v: 0
    };
  });

  return demoOpportunities;
};

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set token when component mounts
  useEffect(() => {
    if (token) {
      apiClient.token = token;
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      try {
        const opportunities: Opportunity[] = await apiClient.getOpportunities();
        
        const processedData: DashboardData = {
          opportunities,
          byCategory: processCategoryData(opportunities),
          byStage: processStageData(opportunities),
          bySource: processSourceData(opportunities),
          scoreDistribution: processScoreData(opportunities),
          byHour: processHourData(opportunities),
          heatmap: processHeatmapData(opportunities),
        };
        
        setData(processedData);
      } catch (apiError: unknown) {
        // If API fails, use demo data
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
        setError(errorMessage);
        const demoData = generateDemoData();
        const processedData: DashboardData = {
          opportunities: demoData,
          byCategory: processCategoryData(demoData),
          byStage: processStageData(demoData),
          bySource: processSourceData(demoData),
          scoreDistribution: processScoreData(demoData),
          byHour: processHourData(demoData),
          heatmap: processHeatmapData(demoData),
        };
        
        setData(processedData);
      }
      
    } catch (fetchError: unknown) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Failed to load data';
      console.error('Failed to fetch data:', fetchError);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-200">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md text-center border border-orange-800">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-500 mb-2">Error Loading Data</h2>
          <p className="text-orange-200 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-orange-200 rounded-xl hover:bg-gray-700 transition-colors border border-orange-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalOpportunities = data?.opportunities.length || 0;
  
  // Calculate average score based on opportunity data
  const avgScore = data && data.opportunities.length > 0 
    ? Math.round(
        data.opportunities.reduce((sum, opp) => {
          let score = 25; 
          if (opp.status === 'qualified') score += 40;
          if (opp.status === 'closed') score += 30;
          if (opp.vehicles.length > 0) score += 15;
          if (opp.quotes.length > 0) score += 20;
          if (opp.jobCards.length > 0) score += 10;
          if (opp.assignedTo) score += 5;
          return sum + Math.max(0, Math.min(100, score));
        }, 0) / data.opportunities.length
      ) 
    : 0;
  
  // Calculate conversion rate (closed opportunities)
  const conversionRate = data && data.opportunities.length > 0
    ? Math.round((data.opportunities.filter(opp => opp.status === 'closed').length / data.opportunities.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-3">Opportunity Heatmap</h1>
        <p className="text-orange-200 text-lg">Visual breakdown of opportunities by time, source, category, stage, and score.</p>
      </div>

      {/* Demo Mode Indicator */}
      {apiClient.isUsingDemoData() && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-orange-900/30 border border-orange-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Demo Mode</span>
              <span>•</span>
              <span className="text-sm">Showing sample data</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl p-6 text-center border border-orange-800">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-300">Total Opportunities</h3>
          </div>
          <p className="text-3xl font-bold text-orange-500">{totalOpportunities}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 text-center border border-orange-800">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-300">Avg Score</h3>
          </div>
          <p className="text-3xl font-bold text-orange-500">{avgScore}%</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 text-center border border-orange-800">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Zap className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-300">Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-orange-500">{conversionRate}%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunities by Hour & Day</h3>
            <HeatmapChart data={data?.heatmap || {}} />
          </div>

          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunities by Category</h3>
            <CategoryChart data={data?.byCategory || {}} />
          </div>

          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunities by Stage</h3>
            <StageChart data={data?.byStage || {}} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunities by Hour</h3>
            <HourChart data={data?.byHour || []} />
          </div>

          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunities by Source</h3>
            <SourceChart data={data?.bySource || {}} />
          </div>

          <div className="bg-gray-900 rounded-xl border border-orange-800 p-6">
            <h3 className="text-xl font-semibold text-orange-300 mb-6">Opportunity Score Distribution</h3>
            <ScoreDistribution data={data?.scoreDistribution || {}} />
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="fixed top-6 right-6 flex items-center space-x-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-orange-500 bg-gray-900 border border-orange-800 rounded-xl hover:bg-orange-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-400 bg-gray-900 border border-red-800 rounded-xl hover:bg-red-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Data processing functions
function processHeatmapData(opportunities: Opportunity[]): { [key: string]: number } {
  const heatmap: { [key: string]: number } = {};
  
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const timeSlots = ['12-8', '8-4'];
  
  // Initialize heatmap
  days.forEach(day => {
    timeSlots.forEach(timeSlot => {
      heatmap[`${day}-${timeSlot}`] = 0;
    });
  });

  opportunities.forEach(opp => {
    const date = new Date(opp.createdAt);
    const day = days[date.getDay()];
    const hour = date.getHours();
    const timeSlot = (hour >= 12 || hour < 8) ? '12-8' : '8-4';
    const key = `${day}-${timeSlot}`;
    
    if (heatmap[key] !== undefined) {
      heatmap[key]++;
    }
  });

  return heatmap;
}

function processHourData(opportunities: Opportunity[]): number[] {
  const hourCounts = Array(9).fill(0); // 8AM to 4PM
  
  opportunities.forEach(opp => {
    const hour = new Date(opp.createdAt).getHours();
    if (hour >= 8 && hour <= 16) {
      hourCounts[hour - 8]++;
    }
  });

  return hourCounts;
}

function processCategoryData(opportunities: Opportunity[]): { [key: string]: number } {
  const counts: { [key: string]: number } = {
    'Service': 0,
    'Parts': 0,
    'Accessories': 0,
    'Consulting': 0,
    'Other': 0
  };
  
  opportunities.forEach(opp => {
    // Map opportunity types and subjects to categories
    if (opp.type === 'individual') {
      if (opp.subject?.includes('Car Service') || opp.subject?.includes('Service')) {
        counts['Service']++;
      } else if (opp.subject?.includes('Parts')) {
        counts['Parts']++;
      } else if (opp.subject?.includes('Accessories')) {
        counts['Accessories']++;
      } else {
        counts['Service']++;
      }
    } else if (opp.type === 'organization') {
      counts['Consulting']++;
    } else {
      counts['Other']++;
    }
  });
  
  return counts;
}

function processStageData(opportunities: Opportunity[]): { [key: string]: number } {
  const counts: { [key: string]: number } = {
    'New': 0,
    'Contact': 0,
    'Qualified': 0,
    'Proposal': 0,
    'Closed': 0
  };
  
  opportunities.forEach(opp => {
    // Map API status to display stages
    const status = opp.status?.toLowerCase() || 'new';
    switch (status) {
      case 'new':
        counts['New']++;
        break;
      case 'contacted':
        counts['Contact']++;
        break;
      case 'qualified':
        counts['Qualified']++;
        break;
      case 'proposal':
        counts['Proposal']++;
        break;
      case 'closed':
        counts['Closed']++;
        break;
      default:
        counts['New']++;
    }
  });
  
  return counts;
}

function processSourceData(opportunities: Opportunity[]): { [key: string]: number } {
  const counts: { [key: string]: number } = {
    'Walk-In': 0,
    'Web': 0,
    'Referral': 0,
    'Social Media': 0,
    'Email': 0,
    'Other': 0
  };
  
  opportunities.forEach(opp => {
    // Map API sources to display names
    const source = opp.source?.toLowerCase() || 'other';
    switch (source) {
      case 'walk_in':
        counts['Walk-In']++;
        break;
      case 'website':
        counts['Web']++;
        break;
      case 'manual':
        counts['Referral']++;
        break;
      case 'social_media':
        counts['Social Media']++;
        break;
      case 'email':
        counts['Email']++;
        break;
      case 'test':
        counts['Other']++;
        break;
      default:
        counts['Other']++;
    }
  });
  
  return counts;
}

function processScoreData(opportunities: Opportunity[]): { [key: string]: number } {
  // Since the API doesn't provide scores, we'll generate some based on status
  const distribution = {
    '0-25': 0,
    '26-50': 0,
    '51-75': 0,
    '76-100': 0,
  };
  
  opportunities.forEach(opp => {
    // Generate pseudo-scores based on opportunity data
    let score = 25; // base score
    
    // Adjust based on status
    if (opp.status === 'qualified') score += 40;
    if (opp.status === 'closed') score += 30;
    if (opp.vehicles.length > 0) score += 15;
    if (opp.quotes.length > 0) score += 20;
    if (opp.jobCards.length > 0) score += 10;
    if (opp.assignedTo) score += 5;
    
    // Ensure score is between 0-100
    score = Math.min(100, score);
    
    if (score <= 25) distribution['0-25']++;
    else if (score <= 50) distribution['26-50']++;
    else if (score <= 75) distribution['51-75']++;
    else distribution['76-100']++;
  });
  
  return distribution;
}