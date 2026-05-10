import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  const start = new Date(trip.start_date).toLocaleDateString('en-IN', { month:'short', day:'numeric', year:'numeric' });
  const end = new Date(trip.end_date).toLocaleDateString('en-IN', { month:'short', day:'numeric', year:'numeric' });
  return (
    <Link to={`/itinerary/${trip.id}`} className="card overflow-hidden block">
      <img src={trip.cover_photo || 'https://picsum.photos/400/200'} className="w-full h-40 object-cover" alt={trip.name} />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{start} — {end}</p>
        <p className="text-xs text-brand-600 mb-2"><i className="fas fa-route mr-1"></i>{trip.stops?.length || 0} stops</p>
        <div className="flex justify-between items-center"><span className="badge bg-brand-50 text-brand-700">₹{trip.budget?.toLocaleString('en-IN')}</span></div>
      </div>
    </Link>
  );
}