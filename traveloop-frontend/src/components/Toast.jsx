import { useEffect, useState } from 'react';

let toastId = 0;
let listeners = [];

export const showToast = (message, type = 'info') => {
  const id = toastId++;
  const toast = { id, message, type };
  listeners.forEach(fn => fn(toast));
  setTimeout(() => {
    listeners.forEach(fn => fn({ ...toast, remove: true }));
  }, 3000);
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter(fn => fn !== handler); };
  }, []);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-white ${t.type === 'error' ? 'bg-red-500' : t.type === 'success' ? 'bg-green-500' : 'bg-brand-600'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}