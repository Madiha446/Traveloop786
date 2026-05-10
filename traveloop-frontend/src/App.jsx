import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Budget from './pages/Budget';
import Packing from './pages/Packing';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import TripNotes from './pages/TripNotes';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/itinerary/:id" element={<ItineraryBuilder />} />
            <Route path="/itinerary-view/:id" element={<ItineraryView />} />
            <Route path="/city-search" element={<CitySearch />} />
            <Route path="/activities" element={<ActivitySearch />} />
            <Route path="/budget/:id" element={<Budget />} />
            <Route path="/packing/:id" element={<Packing />} />
            <Route path="/shared/:shareCode" element={<SharedItinerary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notes/:id" element={<TripNotes />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;