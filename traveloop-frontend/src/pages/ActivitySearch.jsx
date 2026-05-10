import { useEffect, useState } from 'react';
import API from '../services/api';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { user } = useAuth();
  const types = ['all', 'sightseeing', 'food', 'adventure', 'culture', 'shopping'];

  useEffect(() => {
    API.get('/activities').then(res => { setActivities(res.data); setFiltered(res.data); });
  }, []);

  useEffect(() => {
    let f = activities;
    if (search) f = f.filter(a => a.name.toLowerCase().includes(search) || a.description.toLowerCase().includes(search));
    if (typeFilter !== 'all') f = f.filter(a => a.type === typeFilter);
    setFiltered(f);
  }, [search, typeFilter, activities]);

  const addToTrip = async (activity) => {
    try {
      const tripsRes = await API.get('/trips');
      const trip = tripsRes.data[0];
      if (!trip) return showToast('Create a trip first', 'error');
      const stop = trip.stops?.find(s => s.city_id === activity.city_id);
      if (!stop) return showToast(`Add ${activity.city?.name || 'the city'} to your trip first`, 'error');
      await API.post(`/trips/stops/${stop.id}/activities`, { activity_id: activity.id, date: stop.start_date, time: '10:00' });
      showToast(`"${activity.name}" added to trip!`, 'success');
    } catch (err) {
      showToast('Error adding activity', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Find Activities</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search activities..." className="input-field max-w-md" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition ${typeFilter === t ? 'border-brand-700 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500'}`}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(act => (
          <div key={act.id} className="card overflow-hidden">
            <img src={act.image} className="w-full h-36 object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-2"><span className="badge bg-brand-50 text-brand-700">{act.type}</span><span className="text-xs text-gray-400">{act.duration}h</span></div>
              <h3 className="font-bold mt-1">{act.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{act.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-saffron-600">₹{act.cost}</span>
                <button onClick={() => addToTrip(act)} className="btn-primary text-sm py-1.5 px-3"><i className="fas fa-plus mr-1"></i>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}