import { useEffect, useState } from 'react';
import API from '../services/api';
import TripCard from '../components/TripCard';
import { Link } from 'react-router-dom';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  useEffect(() => { API.get('/trips').then(res => setTrips(res.data)); }, []);
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">My Trips</h1><Link to="/create-trip" className="btn-accent"><i className="fas fa-plus mr-2"></i>New Trip</Link></div>
      {trips.length === 0 ? <div className="card p-12 text-center text-gray-400">No trips yet.</div> : 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{trips.map(t => <TripCard key={t.id} trip={t} />)}</div>}
    </div>
  );
}