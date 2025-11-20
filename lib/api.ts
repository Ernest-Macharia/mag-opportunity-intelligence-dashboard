const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mag-backend-0gn4.onrender.com/api/v1';

export interface Opportunity {
  _id: string;
  type: string;
  subject: string;
  source: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    _id: string;
  };
  vehicles: Array<{
    _id: string;
    vin: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color: string;
  }>;
  jobCards: Array<{
    _id: string;
    jobTitle: string;
    status: string;
  }>;
  waivers: any[];
  quotes: Array<{
    _id: string;
    quoteNumber: string;
    totalAmount: number;
    status: string;
  }>;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const apiClient = {
  token: '',
  dataSource: 'live',

  async login(email: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.accessToken) {
        throw new Error('No access token received from server');
      }
      
      this.token = data.accessToken;
      console.log('Login successful, access token received');
      return data.accessToken;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getOpportunities(): Promise<Opportunity[]> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    try {
      console.log('Fetching opportunities with token...');
      
      const response = await fetch(`${API_BASE}/opportunities`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Opportunities response status:', response.status);

      if (response.status === 401) {
        throw new Error('Authentication failed - token may be invalid or expired');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.status}`);
      }

      const data = await response.json();
      console.log('Opportunities data received:', data.length, 'items');
      
      this.dataSource = 'live-api';
      return data as Opportunity[];
    } catch (error) {
      console.error('getOpportunities error:', error);
      this.dataSource = 'demo-error';
      throw error;
    }
  },

  isUsingDemoData(): boolean {
    return this.dataSource.includes('demo');
  },

  logout() {
    this.token = '';
    this.dataSource = 'live';
  },
};