import React from 'react';
import { Link ,useLocation,useNavigate} from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname==='/Home';
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <nav className="bg-[#1A1D24] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              SocialDash
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {isHome ?(
 <button onClick={handleLogout} className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-8 rounded-lg border border-gray-700 transition-colors">
 Logout
</button>)
             :(
              <>
                <Link to="/login" className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-8 rounded-lg border border-gray-700 transition-colors">
                  Login
                </Link>

                <Link to="/sign" className="bg-white hover:bg-gray-100 text-[#0F1117] font-medium py-2.5 px-8 rounded-lg transition-colors">
                  Register
            </Link>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 