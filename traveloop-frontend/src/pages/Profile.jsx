import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { showToast } from '../components/Toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', language: user?.language || 'en' });
  const [saved, setSaved] = useState([]);

  const handleSave = async () => {
    try {
      await API.put(`/users/${user.id}`, form); // assuming backend has /api/users/me endpoint
      showToast('Profile updated', 'success');
    } catch (err) { showToast('Update failed', 'error'); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center"><div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4"><i className="fas fa-user text-brand-600 text-4xl"></i></div><h2 className="text-xl font-bold">{user?.name}</h2><p className="text-gray-500">{user?.email}</p><span className="badge bg-saffron-50 text-saffron-700 mt-2 inline-block">{user?.is_admin ? 'Admin' : 'Traveller'}</span></div>
        <div className="card p-6 md:col-span-2"><h3 className="font-bold mb-4">Edit Profile</h3><div className="space-y-4"><input type="text" placeholder="Full Name" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><input type="email" placeholder="Email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /><select className="input-field" value={form.language} onChange={e => setForm({...form, language: e.target.value})}><option value="en">English</option><option value="hi">हिंदी</option><option value="ta">தமிழ்</option></select><button onClick={handleSave} className="btn-primary">Save Changes</button></div></div>
      </div>
      <div className="mt-8 card p-6 border-red-200"><h3 className="font-bold text-red-600 mb-2">Danger Zone</h3><p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data.</p><button onClick={() => showToast('Account deletion is disabled in demo', 'info')} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold">Delete Account</button></div>
    </div>
  );
}