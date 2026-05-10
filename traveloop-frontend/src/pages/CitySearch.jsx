import { useEffect, useState } from 'react';
import API from '../services/api';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function CitySearch() {
  const [cities, setCities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/cities').then(res => { setCities(res.data); setFiltered(res.data); });
  }, []);

  useEffect(() => {
    let f = cities;
    if (search) f = f.filter(c => c.name.toLowerCase().includes(search) || c.region.toLowerCase().includes(search));
    if (region) f = f.filter(c => c.region === region);
    setFiltered(f);
  }, [search, region, cities]);

  const addToTrip = async (cityId) => {
    try {
      const tripsRes = await API.get('/trips');
      const trip = tripsRes.data[0];
      if (!trip) return showToast('Create a trip first!', 'error');
      await API.post(`/trips/${trip.id}/stops`, {
        city_id: cityId,
        start_date: trip.start_date,
        end_date: trip.start_date,
        order_index: trip.stops?.length || 0,
        transport_cost: 0,
        stay_cost: 0,
        meals_cost: 0
      });
      showToast('City added to trip!', 'success');
    } catch (err) {
      showToast('Error adding city', 'error');
    }
  };

  const regions = [...new Set(cities.map(c => c.region))];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Explore Cities</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search cities..." className="input-field max-w-md" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input-field w-auto" value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(city => (
          <div key={city.id} className="card overflow-hidden">
            <img src={city.image} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between"><h3 className="font-bold text-lg">{city.name}</h3><span className="text-sm text-amber-500"><i className="fas fa-star"></i> {city.popularity}</span></div>
              <p className="text-sm text-gray-500 mt-1">{city.region}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{city.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="badge bg-saffron-50 text-saffron-700">₹{city.cost_index * 1000}/day</span>
                <button onClick={() => addToTrip(city.id)} className="btn-primary text-sm py-1.5 px-3"><i className="fas fa-plus mr-1"></i>Add to Trip</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}