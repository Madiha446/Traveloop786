import { useEffect, useState } from 'react';
import API from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [activityTypes, setActivityTypes] = useState({});

  useEffect(() => {
    if (user?.is_admin) {
      API.get('/admin/stats').then(res => setStats(res.data));
      API.get('/admin/users').then(res => setUsers(res.data));
      API.get('/admin/trips').then(res => setTrips(res.data));
      API.get('/admin/top-cities').then(res => setTopCities(res.data));
      API.get('/admin/activity-types').then(res => setActivityTypes(res.data));
    }
  }, [user]);

  if (!user?.is_admin) return <div className="card p-8 text-center"><i className="fas fa-lock text-4xl text-gray-300 mb-3"></i><h3>Admin Access Required</h3></div>;

  const cityBarData = { labels: topCities.map(c => c.city), datasets: [{ label: 'Trips', data: topCities.map(c => c.count), backgroundColor: '#0F766E' }] };
  const pieData = { labels: Object.keys(activityTypes), datasets: [{ data: Object.values(activityTypes), backgroundColor: ['#0F766E','#F97316','#3B82F6','#8B5CF6','#EC4899'] }] };

  return (
    <div><h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1><p className="text-gray-500 mb-6">Platform analytics</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div className="card p-4"><div className="text-2xl font-bold">{stats.total_users}</div><div className="text-sm text-gray-400">Users</div></div><div className="card p-4"><div className="text-2xl font-bold">{stats.total_trips}</div><div className="text-sm text-gray-400">Trips</div></div><div className="card p-4"><div className="text-2xl font-bold">{stats.total_stops}</div><div className="text-sm text-gray-400">Stops</div></div><div className="card p-4"><div className="text-2xl font-bold">{stats.total_activities}</div><div className="text-sm text-gray-400">Activities</div></div></div>
      <div className="grid md:grid-cols-2 gap-6 mb-8"><div className="card p-6"><h3 className="font-bold mb-4">Top Cities</h3><Bar data={cityBarData} options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }} /></div><div className="card p-6"><h3 className="font-bold mb-4">Activity Types</h3><Pie data={pieData} /></div></div>
      <div className="card p-6 mb-6"><h3 className="font-bold mb-4">Users</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Name</th><th className="text-left p-2">Email</th><th className="text-left p-2">Trips</th><th className="text-left p-2">Role</th></tr></thead><tbody>{users.map(u => (<tr key={u.id} className="border-b"><td className="p-2">{u.name}</td><td className="p-2">{u.email}</td><td className="p-2">{trips.filter(t=>t.user_id===u.id).length}</td><td className="p-2">{u.is_admin ? 'Admin' : 'User'}</td></tr>))}</tbody></table></div></div>
    </div>
  );
}