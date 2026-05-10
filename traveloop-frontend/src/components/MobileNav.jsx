import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <>
      <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-lg z-30 border-b px-4 py-3 flex items-center justify-between border-[#E7E0D6]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center"><i className="fas fa-globe-asia text-white text-sm"></i></div>
          <span className="font-display font-bold text-brand-800">Traveloop</span>
        </div>
        <button id="mobile-menu-btn" className="w-9 h-9 rounded-lg bg-warm-100 flex items-center justify-center"><i className="fas fa-bars text-gray-600"></i></button>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30 flex justify-around py-2 border-[#E7E0D6]">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-xs text-gray-500"><i className="fas fa-home text-lg"></i>Home</Link>
        <Link to="/my-trips" className="flex flex-col items-center gap-0.5 text-xs text-gray-500"><i className="fas fa-suitcase-rolling text-lg"></i>Trips</Link>
        <Link to="/create-trip" className="flex flex-col items-center gap-0.5"><div className="w-12 h-12 -mt-6 rounded-full bg-saffron-500 flex items-center justify-center shadow-lg"><i className="fas fa-plus text-white text-lg"></i></div></Link>
        <Link to="/city-search" className="flex flex-col items-center gap-0.5 text-xs text-gray-500"><i className="fas fa-search text-lg"></i>Explore</Link>
        <Link to="/profile" className="flex flex-col items-center gap-0.5 text-xs text-gray-500"><i className="fas fa-user text-lg"></i>Profile</Link>
      </div>
    </>
  );
}