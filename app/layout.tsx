import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Opportunity Dashboard',
  description: 'Real-time opportunity tracking and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}