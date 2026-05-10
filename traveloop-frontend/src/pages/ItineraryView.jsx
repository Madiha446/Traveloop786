import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { showToast } from '../components/Toast';

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [mode, setMode] = useState('timeline');

  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data)).catch(() => showToast('Error loading trip', 'error'));
  }, [id]);

  if (!trip) return <div className="p-8 text-center">Loading...</div>;

  const sortedStops = [...(trip.stops || [])].sort((a,b) => a.order_index - b.order_index);
  const totalCost = (trip.stops || []).reduce((sum, s) => sum + (s.transport_cost + s.stay_cost + s.meals_cost + (s.activities || []).reduce((a,b) => a + (b.activity?.cost || 0),0)), 0);

  return (
    <div>
      <Link to="/my-trips" className="text-sm text-gray-500 hover:text-brand-600 mb-4 inline-block">&larr; Back to My Trips</Link>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <div><h1 className="text-3xl font-bold">{trip.name}</h1><p className="text-gray-500">{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()} | ₹{totalCost.toLocaleString('en-IN')}</p></div>
        <div className="flex gap-2">
          <Link to={`/itinerary/${id}`} className="btn-outline text-sm"><i className="fas fa-pen mr-1"></i> Edit</Link>
          <Link to={`/shared/${trip.share_code || ''}`} className="btn-primary text-sm"><i className="fas fa-share-alt mr-1"></i> Share</Link>
        </div>
      </div>
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setMode('timeline')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'timeline' ? 'bg-brand-700 text-white' : 'text-gray-600'}`}>Timeline</button>
        <button onClick={() => setMode('list')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === 'list' ? 'bg-brand-700 text-white' : 'text-gray-600'}`}>List by City</button>
      </div>
      {mode === 'timeline' && (
        <div className="space-y-8">
          {sortedStops.map((stop, idx) => {
            const city = stop.city;
            const activities = stop.activities || [];
            return (
              <div key={stop.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">{idx+1}</div>
                  <div><h2 className="text-xl font-bold">{city?.name}</h2><p className="text-sm text-gray-500">{city?.region} | {new Date(stop.start_date).toLocaleDateString()} — {new Date(stop.end_date).toLocaleDateString()}</p></div>
                </div>
                <div className="ml-5 border-l-2 border-brand-200 pl-6 space-y-3">
                  {activities.length === 0 && <p className="text-gray-400 italic">No activities scheduled</p>}
                  {activities.map(act => (
                    <div key={act.id} className="relative pl-4 before:absolute before:left-[-10px] before:top-2 before:w-3 before:h-3 before:bg-brand-500 before:rounded-full before:border-2 before:border-white">
                      <div className="card p-3 flex items-center gap-3">
                        <img src={act.activity?.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div className="flex-1"><div className="font-semibold">{act.activity?.name}</div><div className="text-xs text-gray-400">{act.date} {act.time}</div></div>
                        <span className="badge bg-saffron-50 text-saffron-600">₹{act.activity?.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {mode === 'list' && (
        <div className="space-y-4">
          {sortedStops.map(stop => {
            const city = stop.city;
            return (
              <div key={stop.id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={city?.image} className="w-14 h-14 rounded-xl object-cover" />
                  <div><h3 className="text-lg font-bold">{city?.name}</h3><p className="text-xs text-gray-500">{new Date(stop.start_date).toLocaleDateString()} — {new Date(stop.end_date).toLocaleDateString()} | Transport: ₹{stop.transport_cost} | Stay: ₹{stop.stay_cost} | Meals: ₹{stop.meals_cost}</p></div>
                </div>
                {(stop.activities || []).length === 0 ? <p className="text-gray-400 text-sm">No activities</p> :
                  <div className="space-y-2">{stop.activities.map(act => (
                    <div key={act.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"><img src={act.activity?.image} className="w-8 h-8 rounded object-cover"/><div className="flex-1 text-sm">{act.activity?.name}</div><span className="text-xs text-gray-400">{act.activity?.duration}h</span><span className="text-sm font-semibold text-saffron-600">₹{act.activity?.cost}</span></div>
                  ))}</div>
                }
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to={`/budget/${id}`} className="card p-4 text-center hover:border-brand-400"><i className="fas fa-wallet text-xl text-brand-600"></i><div className="text-sm font-semibold mt-1">Budget</div></Link>
        <Link to={`/packing/${id}`} className="card p-4 text-center hover:border-brand-400"><i className="fas fa-check-square text-xl text-green-600"></i><div className="text-sm font-semibold mt-1">Packing</div></Link>
        <Link to={`/notes/${id}`} className="card p-4 text-center hover:border-brand-400"><i className="fas fa-sticky-note text-xl text-amber-600"></i><div className="text-sm font-semibold mt-1">Notes</div></Link>
        <Link to={`/shared/${trip.share_code || ''}`} className="card p-4 text-center hover:border-brand-400"><i className="fas fa-share-alt text-xl text-saffron-500"></i><div className="text-sm font-semibold mt-1">Share</div></Link>
      </div>
    </div>
  );
}