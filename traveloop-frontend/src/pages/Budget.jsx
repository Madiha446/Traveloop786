import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Budget() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  useEffect(() => { API.get(`/trips/${id}`).then(res => setTrip(res.data)); }, [id]);
  if (!trip) return <div>Loading...</div>;

  const stops = trip.stops || [];
  const transport = stops.reduce((s,stop) => s + (stop.transport_cost || 0), 0);
  const stay = stops.reduce((s,stop) => s + (stop.stay_cost || 0), 0);
  const meals = stops.reduce((s,stop) => s + (stop.meals_cost || 0), 0);
  const activitiesCost = stops.reduce((s,stop) => s + (stop.activities || []).reduce((a,b) => a + (b.activity?.cost || 0), 0), 0);
  const total = transport + stay + meals + activitiesCost;
  const perDay = total / (Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000*60*60*24)) || 1);
  const overBudget = trip.budget && total > trip.budget;

  const pieData = { labels: ['Transport', 'Stay', 'Meals', 'Activities'], datasets: [{ data: [transport, stay, meals, activitiesCost], backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#0F766E'] }] };
  const barData = { labels: stops.map(s => s.city?.name || 'Unknown'), datasets: [{ label: 'Cost (₹)', data: stops.map(s => (s.transport_cost + s.stay_cost + s.meals_cost + (s.activities || []).reduce((a,b)=>a+(b.activity?.cost||0),0))), backgroundColor: '#0F766E' }] };

  return (
    <div>
      <Link to={`/itinerary-view/${id}`} className="text-sm text-gray-500 hover:text-brand-600 mb-4 inline-block">&larr; Back to Itinerary</Link>
      <h1 className="text-3xl font-bold mb-2">Budget Breakdown</h1>
      {overBudget && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4">⚠️ You are ₹{(total - trip.budget).toLocaleString('en-IN')} over your budget of ₹{trip.budget.toLocaleString('en-IN')}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center"><div className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</div><div className="text-sm text-gray-400">Total</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-bold text-brand-600">₹{Math.round(perDay).toLocaleString('en-IN')}</div><div className="text-sm text-gray-400">Per Day</div></div>
        <div className="card p-4 text-center"><div className={`text-2xl font-bold ${overBudget ? 'text-red-500' : 'text-green-600'}`}>₹{Math.abs(trip.budget - total).toLocaleString('en-IN')}</div><div className="text-sm text-gray-400">{overBudget ? 'Over Budget' : 'Remaining'}</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-bold text-saffron-600">₹{trip.budget?.toLocaleString('en-IN') || 0}</div><div className="text-sm text-gray-400">Budget</div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6"><h3 className="font-bold mb-4">Distribution</h3><Pie data={pieData} /></div>
        <div className="card p-6"><h3 className="font-bold mb-4">Cost by Destination</h3><Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
      </div>
      <div className="card p-6">
        <h3 className="font-bold mb-4">Detailed Breakdown</h3>
        {[
          { label: 'Transport', value: transport, color: 'blue', icon: 'fa-train' },
          { label: 'Accommodation', value: stay, color: 'green', icon: 'fa-bed' },
          { label: 'Activities', value: activitiesCost, color: 'teal', icon: 'fa-ticket-alt' },
          { label: 'Meals', value: meals, color: 'amber', icon: 'fa-utensils' }
        ].map(cat => (
          <div key={cat.label} className="mb-3"><div className="flex justify-between text-sm"><span><i className={`fas ${cat.icon} text-${cat.color}-500 mr-2`}></i>{cat.label}</span><span className="font-bold">₹{cat.value.toLocaleString('en-IN')}</span></div><div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden"><div className={`bg-${cat.color}-500 h-full rounded-full`} style={{ width: `${total ? (cat.value/total)*100 : 0}%` }}></div></div></div>
        ))}
      </div>
    </div>
  );
}