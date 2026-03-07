import './globals.css';
import Sidebar from '@/components/Layout/Sidebar';
import BottomNav from '@/components/Layout/BottomNav';
import Header from '@/components/Layout/Header';

export const metadata = {
  title: 'Mediora AI - Smart Medication Management',
  description: 'AI-assisted medication safety platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64">
            <Header />
            <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
              {children}
            </main>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}