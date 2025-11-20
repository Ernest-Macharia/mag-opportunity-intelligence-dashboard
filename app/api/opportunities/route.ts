import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mag-backend-0gn4.onrender.com/api/v1';

const generateDemoData = () => {
  const categories = ['Service', 'Parts', 'Accessories', 'Consulting'];
  const sources = ['website', 'referral', 'walk_in', 'social_media', 'email'];
  const stages = ['new', 'contacted', 'qualified', 'proposal', 'closed'];
  
  const demoOpportunities = Array.from({ length: 48 }, (_, i) => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    randomDate.setHours(8 + Math.floor(Math.random() * 9));
    
    return {
      id: `demo-${i + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      stage: stages[Math.floor(Math.random() * stages.length)],
      score: Math.floor(Math.random() * 101),
      createdAt: randomDate.toISOString(),
      converted: Math.random() > 0.7,
    };
  });

  return demoOpportunities;
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const demoData = generateDemoData();
      return NextResponse.json(demoData, {
        headers: { 'X-Data-Source': 'demo-no-auth' }
      });
    }

    const response = await fetch(`${API_BASE}/opportunities`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return NextResponse.json(data, { 
          headers: { 'X-Data-Source': 'live-api' }
        });
      }
    }

    const demoData = generateDemoData();
    return NextResponse.json(demoData, {
      headers: { 'X-Data-Source': 'demo-fallback' }
    });
    
  } catch (error: any) {
    const demoData = generateDemoData();
    return NextResponse.json(demoData, {
      headers: { 'X-Data-Source': 'demo-error' }
    });
  }
}