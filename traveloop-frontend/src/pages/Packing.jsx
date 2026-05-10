import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { showToast } from '../components/Toast';

export default function Packing() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: 'clothing' });

  const fetchItems = async () => {
    const res = await API.get(`/packing/${id}`);
    setItems(res.data);
  };
  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data));
    fetchItems();
  }, [id]);

  const addItem = async () => {
    if (!newItem.name) return;
    await API.post(`/packing/${id}`, newItem);
    fetchItems();
    setNewItem({ name: '', category: 'clothing' });
    showToast('Item added', 'success');
  };
  const togglePacked = async (item) => {
    await API.put(`/packing/${item.id}`, { ...item, is_packed: !item.is_packed });
    fetchItems();
  };
  const deleteItem = async (itemId) => {
    await API.delete(`/packing/${itemId}`);
    fetchItems();
  };
  const resetChecklist = async () => {
    for (let item of items) {
      await API.put(`/packing/${item.id}`, { ...item, is_packed: false });
    }
    fetchItems();
  };
  const addTemplate = async () => {
    const template = {
      clothing: ['T-shirts (x3)', 'Jeans', 'Underwear (x5)', 'Socks (x5)', 'Jacket', 'Walking Shoes'],
      documents: ['Aadhaar Card', 'Passport', 'Flight Tickets', 'Hotel Vouchers'],
      electronics: ['Phone Charger', 'Power Bank', 'Camera'],
      toiletries: ['Toothbrush', 'Sunscreen', 'Mosquito Repellent', 'Medicines'],
      other: ['Water Bottle', 'Snacks', 'Travel Pillow']
    };
    for (let [cat, itemsArr] of Object.entries(template)) {
      for (let name of itemsArr) {
        await API.post(`/packing/${id}`, { name, category: cat, is_packed: false });
      }
    }
    fetchItems();
    showToast('Template added', 'success');
  };

  const packedCount = items.filter(i => i.is_packed).length;
  const percent = items.length ? (packedCount/items.length)*100 : 0;
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div>
      <Link to={`/itinerary-view/${id}`} className="text-sm text-gray-500 hover:text-brand-600 mb-4 inline-block">&larr; Back to Itinerary</Link>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6"><div><h1 className="text-3xl font-bold">Packing Checklist</h1><p className="text-gray-500">{trip?.name} | {packedCount}/{items.length} packed</p></div><div><button onClick={resetChecklist} className="btn-outline mr-2 text-sm">Reset</button><button onClick={addTemplate} className="btn-primary text-sm"><i className="fas fa-magic mr-1"></i>Add Template</button></div></div>
      <div className="card p-4 mb-6"><div className="flex justify-between mb-1"><span className="text-sm font-semibold">Progress</span><span>{Math.round(percent)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-brand-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div></div></div>
      <div className="card p-4 mb-6"><div className="flex gap-2"><input type="text" placeholder="Item name" className="input-field flex-1" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} /><select className="input-field w-auto" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}><option value="clothing">Clothing</option><option value="documents">Documents</option><option value="electronics">Electronics</option><option value="toiletries">Toiletries</option><option value="other">Other</option></select><button onClick={addItem} className="btn-primary"><i className="fas fa-plus"></i></button></div></div>
      {categories.map(cat => (
        <div key={cat} className="card p-5 mb-4"><h3 className="font-bold mb-3 uppercase text-sm text-gray-500">{cat}</h3>{items.filter(i => i.category === cat).map(item => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100"><div className="flex items-center gap-3"><input type="checkbox" checked={item.is_packed} onChange={() => togglePacked(item)} className="w-4 h-4 accent-brand-600" /><span className={item.is_packed ? 'line-through text-gray-400' : ''}>{item.name}</span></div><button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button></div>
        ))}</div>
      ))}
    </div>
  );
}