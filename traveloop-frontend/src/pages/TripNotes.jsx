import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { showToast } from '../components/Toast';

export default function TripNotes() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [trip, setTrip] = useState(null);
  const [content, setContent] = useState('');
  const [stopId, setStopId] = useState('');

  const fetchNotes = async () => {
    const res = await API.get(`/notes/${id}`);
    setNotes(res.data);
  };
  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data));
    fetchNotes();
  }, [id]);

  const addNote = async () => {
    if (!content.trim()) return;
    await API.post(`/notes/${id}`, { content, stop_id: stopId || null });
    fetchNotes();
    setContent('');
    showToast('Note added', 'success');
  };
  const deleteNote = async (noteId) => {
    await API.delete(`/notes/${noteId}`);
    fetchNotes();
  };
  const editNote = async (note) => {
    const newContent = prompt('Edit note:', note.content);
    if (newContent) {
      await API.put(`/notes/${note.id}`, { content: newContent, stop_id: note.stop_id });
      fetchNotes();
    }
  };

  return (
    <div>
      <Link to={`/itinerary-view/${id}`} className="text-sm text-gray-500 hover:text-brand-600 mb-4 inline-block">&larr; Back to Itinerary</Link>
      <h1 className="text-3xl font-bold mb-2">Trip Notes</h1>
      <div className="card p-5 mb-6"><textarea className="input-field mb-3" rows="3" placeholder="Write a note..." value={content} onChange={e => setContent(e.target.value)}></textarea><div className="flex gap-2"><select className="input-field w-auto" value={stopId} onChange={e => setStopId(e.target.value)}><option value="">General note</option>{(trip?.stops || []).map(s => <option key={s.id} value={s.id}>{s.city?.name}</option>)}</select><button onClick={addNote} className="btn-primary"><i className="fas fa-plus mr-1"></i>Add Note</button></div></div>
      {notes.length === 0 && <div className="card p-8 text-center text-gray-400"><i className="fas fa-sticky-note text-4xl mb-2"></i><p>No notes yet.</p></div>}
      <div className="space-y-3">{notes.map(note => (
        <div key={note.id} className="card p-5"><div className="flex justify-between"><div className="flex-1"><p className="whitespace-pre-wrap">{note.content}</p><div className="flex gap-3 mt-2 text-xs text-gray-400"><span><i className="far fa-clock mr-1"></i>{new Date(note.timestamp).toLocaleString()}</span>{note.stop_id && <span className="badge bg-brand-50 text-brand-700">{trip?.stops?.find(s=>s.id===note.stop_id)?.city?.name}</span>}</div></div><div className="flex gap-1"><button onClick={() => editNote(note)} className="text-gray-400 hover:text-brand-600"><i className="fas fa-pen"></i></button><button onClick={() => deleteNote(note.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button></div></div></div>
      ))}</div>
    </div>
  );
}