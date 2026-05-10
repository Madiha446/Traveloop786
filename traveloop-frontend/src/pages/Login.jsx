import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await API.post('/auth/signup', { name, email, password });
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-800 to-brand-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-saffron-500 flex items-center justify-center"><i className="fas fa-globe-asia text-white text-xl"></i></div>
            <span className="text-3xl font-display font-bold text-brand-800">Traveloop</span>
          </div>
          <p className="text-gray-500 text-sm">Personalized Travel Planning</p>
        </div>
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${isLogin ? 'bg-brand-700 text-white' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!isLogin ? 'bg-brand-700 text-white' : 'text-gray-500'}`}>Sign Up</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
          <button type="submit" className="btn-primary w-full">{isLogin ? 'Log In' : 'Create Account'}</button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Demo: any email & password works</p>
      </div>
    </div>
  );
}