
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold font-mono text-black-300">MedStroke</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 font-mono hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/form" className="text-gray-700 font-mono hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Form
            </Link>
            <Link to="/dashboard" className="text-gray-700 font-mono hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </Link> 
            <Link to="/form">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 shadow-md shadow-gray-500 rounded-sm text-sm font-medium">
                Analyze Your Health
              </button>
            </Link>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
