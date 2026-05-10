import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', budget: 0, cover_photo: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/trips', form);
      navigate(`/itinerary/${res.data.id}`);
    } catch (err) { alert('Error creating trip'); }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Create a New Trip</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <input type="text" placeholder="Trip Name" className="input-field" required onChange={e => setForm({...form, name: e.target.value})} />
        <textarea placeholder="Description" className="input-field" rows="3" onChange={e => setForm({...form, description: e.target.value})}></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="input-field" required onChange={e => setForm({...form, start_date: e.target.value})} />
          <input type="date" className="input-field" required onChange={e => setForm({...form, end_date: e.target.value})} />
        </div>
        <input type="number" placeholder="Budget (₹)" className="input-field" onChange={e => setForm({...form, budget: parseFloat(e.target.value)})} />
        <input type="text" placeholder="Cover Photo URL" className="input-field" onChange={e => setForm({...form, cover_photo: e.target.value})} />
        <button type="submit" className="btn-primary w-full">Create Trip</button>
      </form>
    </div>
  );
}