export interface Opportunity {
  _id: string;
  type: string;
  subject: string;
  source: string;
  status: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    companyName?: string;
    _id: string;
  };
  vehicles: any[];
  jobCards: any[];
  waivers: any[];
  quotes: any[];
  assignedTo: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DashboardData {
  opportunities: Opportunity[];
  byCategory: { [key: string]: number };
  byStage: { [key: string]: number };
  bySource: { [key: string]: number };
  scoreDistribution: { [key: string]: number };
  byHour: number[];
  heatmap: { [key: string]: number };
}

export interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export interface ChartProps {
  data: { [key: string]: number };
}