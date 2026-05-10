import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data));
    API.get('/cities').then(res => setCities(res.data));
  }, [id]);
  const addStop = async () => { /* ... */ };
  if (!trip) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold">{trip.name}</h1>
      <p className="text-gray-500 mb-4">Add stops and activities</p>
      <div className="card p-4 mb-4">
        <h3 className="font-semibold mb-2">Stops</h3>
        {trip.stops?.map(s => <div key={s.id}>{s.city?.name}</div>)}
        <button onClick={addStop} className="btn-outline mt-2">+ Add Stop</button>
      </div>
      {/* Full builder with modal would be here */}
    </div>
  );
}