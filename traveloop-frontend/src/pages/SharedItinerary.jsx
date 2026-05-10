import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function SharedItinerary() {
  const { shareCode } = useParams();
  const [trip, setTrip] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/shared/${shareCode}`).then(res => setTrip(res.data)).catch(() => showToast('Trip not found or not shared', 'error'));
  }, [shareCode]);

  if (!trip) return <div className="p-8 text-center">Loading shared itinerary...</div>;

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); };
  const copyTrip = async () => {
    try {
      // This endpoint should be implemented on backend: POST /api/trips/copy/:id
      // For simplicity, we just show a toast here
      showToast('Copy feature: implement backend /trips/copy endpoint', 'info');
    } catch { showToast('Error copying trip', 'error'); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Shared by {trip.owner?.name}</h3><button onClick={copyLink} className="btn-outline text-sm"><i className="fas fa-copy mr-1"></i>Copy Link</button></div>
        {user && <button onClick={copyTrip} className="btn-primary w-full"><i className="fas fa-copy mr-2"></i>Copy This Trip to My Account</button>}
        {!user && <p className="text-sm text-gray-500 mt-2">Log in to copy this trip to your account.</p>}
      </div>
      <div className="card overflow-hidden">
        <img src={trip.cover_photo} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h2 className="font-bold text-2xl">{trip.name}</h2>
          <p className="text-gray-500 text-sm mb-3">{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</p>
          <p className="text-gray-600 mb-4">{trip.description}</p>
          {(trip.stops || []).sort((a,b)=>a.order_index-b.order_index).map((stop, idx) => (
            <div key={stop.id} className="mb-4 border-t pt-3 first:border-t-0 first:pt-0"><h3 className="font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">{idx+1}</span>{stop.city?.name}</h3><p className="text-xs text-gray-400 ml-8 mb-2">{new Date(stop.start_date).toLocaleDateString()} — {new Date(stop.end_date).toLocaleDateString()}</p>{(stop.activities || []).map(act => (<div key={act.id} className="ml-8 flex items-center gap-2 text-sm"><i className="fas fa-circle text-brand-400 text-[5px]"></i>{act.activity?.name} <span className="ml-auto text-saffron-600">₹{act.activity?.cost}</span></div>))}</div>
          ))}
          <div className="mt-4 pt-4 border-t flex justify-between"><span className="text-gray-500">Total estimated</span><span className="text-xl font-bold text-saffron-600">₹{ (trip.stops || []).reduce((s,stop)=> s + stop.transport_cost + stop.stay_cost + stop.meals_cost + (stop.activities || []).reduce((a,b)=> a + (b.activity?.cost||0),0), 0).toLocaleString('en-IN') }</span></div>
        </div>
      </div>
    </div>
  );
}