import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 pb-20 md:pb-0">
        <MobileNav />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}