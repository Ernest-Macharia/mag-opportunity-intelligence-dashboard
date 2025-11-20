Quick Start
Prerequisites
Node.js 18+

npm or yarn

Installation & Setup
Option 1: Clone and Setup (Recommended)

bash
# Clone the repository
git clone https://github.com/Ernest-Machariamag-opportunity-intelligence-dashboard
cd mag-opportunity-dashboarde-intelligence

# Install dependencies
npm install

# Run development server
npm run dev
Option 2: Create from Scratch

bash
# Create new Next.js project
npx create-next-app@latest opportunity-dashboard --typescript --tailwind --eslint --app
cd opportunity-dashboard

# Install dependencies
npm install lucide-react recharts sonner

# Replace the generated files with the provided code

# Run development server
npm run dev
Open http://localhost:3000 in your browser


Features
Modern Authentication - Secure JWT token-based login

Real-time Analytics - Multiple chart types and visualizations

Responsive Design - Works perfectly on all devices

Demo Mode - Automatic fallback to sample data when API is unavailable

Black & Orange Theme - Consistent dark theme with orange accents

Tech Stack
Framework: Next.js 14 with App Router

Language: TypeScript

Styling: Tailwind CSS

Charts: Recharts

Icons: Lucide React

Dashboard Components
Total Opportunities - Overall count

Average Score - Mean opportunity score

Conversion Rate - Success percentage

Heatmap - Opportunities by hour & day

Category Breakdown - Service categories

Stage Progression - Sales pipeline

Source Analysis - Opportunity origins

Score Distribution - Performance range

API Integration
The app connects to:

Authentication: https://mag-backend-0gn4.onrender.com/api/v1/auth/login

Opportunities: https://mag-backend-0gn4.onrender.com/api/v1/opportunities

Note: If the external API is unavailable, the app automatically shows realistic demo data.

Screenshots
Login page
<img width="1513" height="795" alt="Screenshot from 2025-11-20 13-44-17" src="https://github.com/user-attachments/assets/34c75de2-d34b-4ed1-b2c5-15f9d8c57d09" />

Dashboard Pages

<img width="1513" height="795" alt="Screenshot from 2025-11-20 13-43-54" src="https://github.com/user-attachments/assets/74305b0b-27be-42a1-ab3a-285e1c34ebfa" />
<img width="1513" height="795" alt="Screenshot from 2025-11-20 13-44-08" src="https://github.com/user-attachments/assets/abc489e9-59d5-470e-a4a8-f22be011c5ef" />


