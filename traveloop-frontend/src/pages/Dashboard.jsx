import { useEffect, useState } from 'react';
import API from '../services/api';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [popularCities, setPopularCities] = useState([]);

  useEffect(() => {
    API.get('/trips').then(res => setTrips(res.data));
    API.get('/cities?sort_by=popularity').then(res => setPopularCities(res.data.slice(0,4)));
  }, []);

  const totalSpent = trips.reduce((s, t) => s + (t.budget || 0), 0);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-gray-500 mb-6">Ready for your next adventure?</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4"><div className="text-2xl font-bold">{trips.length}</div><div className="text-sm text-gray-400">Total Trips</div></div>
        <div className="card p-4"><div className="text-2xl font-bold">{trips.reduce((s,t)=>s+t.stops?.length,0)}</div><div className="text-sm text-gray-400">Cities</div></div>
        <div className="card p-4"><div className="text-2xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</div><div className="text-sm text-gray-400">Budget</div></div>
        <div className="card p-4"><div className="text-2xl font-bold">{trips.filter(t=>new Date(t.start_date) > new Date()).length}</div><div className="text-sm text-gray-400">Upcoming</div></div>
      </div>
      <div className="bg-gradient-to-r from-brand-700 to-brand-500 rounded-2xl p-6 mb-8 text-white cursor-pointer" onClick={() => window.location.href='/create-trip'}>
        <h2 className="text-xl font-bold">Plan a New Trip</h2>
        <p className="text-brand-100 text-sm">Create your next multi-city adventure</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Your Trips</h2>
      {trips.length === 0 ? <div className="card p-8 text-center text-gray-400">No trips yet. Create one!</div> : 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{trips.map(t => <TripCard key={t.id} trip={t} />)}</div>
      }
      <h2 className="text-xl font-bold mt-8 mb-4">Popular Destinations</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularCities.map(c => (
          <div key={c.id} className="card overflow-hidden cursor-pointer" onClick={() => window.location.href='/city-search'}>
            <img src={c.image} className="w-full h-32 object-cover" alt={c.name} />
            <div className="p-3"><h3 className="font-semibold">{c.name}</h3><p className="text-xs text-gray-400">{c.region}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}