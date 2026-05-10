import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="hidden md:flex flex-col fixed w-64 h-full bg-white border-r border-[#E7E0D6] z-40">
      <div className="p-5 border-b border-[#E7E0D6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-500 flex items-center justify-center">
            <i className="fas fa-globe-asia text-white"></i>
          </div>
          <span className="text-xl font-display font-bold text-brand-800">Traveloop</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-home w-5"></i>Dashboard</NavLink>
        <NavLink to="/my-trips" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-suitcase-rolling w-5"></i>My Trips</NavLink>
        <NavLink to="/city-search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-city w-5"></i>Explore Cities</NavLink>
        <NavLink to="/activities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-hiking w-5"></i>Activities</NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-user-cog w-5"></i>Profile</NavLink>
        {user?.is_admin && (
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="fas fa-chart-line w-5"></i>Admin</NavLink>
        )}
      </nav>
      <div className="p-4 border-t border-[#E7E0D6]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center"><i className="fas fa-user text-brand-700"></i></div>
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-2"><i className="fas fa-sign-out-alt"></i>Log Out</button>
      </div>
    </aside>
  );
}