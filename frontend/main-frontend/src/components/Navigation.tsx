
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg shadow-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-black-600 font-mono">MedStroke</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-mono font-medium">
              Home
            </Link>
            
            {user && (
              <>
                {user.role === 'Patient' && (
                  <>
                    <Link to="/patient-form" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium font-mono">
                      Submit Form
                    </Link>
                    <Link to="/patient-dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium font-mono">
                      My Dashboard
                    </Link>
                  </>
                )}
                
                {user.role === 'Doctor' && (
                  <>
                    <Link to="/form" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-mono font-medium">
                      Patient Form
                    </Link>
                    <Link to="/doctor-dashboard" className="text-gray-700 font-mono hover:text-purple-600 px-3 py-2 text-sm font-medium">
                      Doctor Dashboard
                    </Link>
                  </>
                )}
                
                {user.role === 'Neurologist' && (
                  <Link to="/neurologist-dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-mono font-medium">
                    Neurologist Dashboard
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md shadow-gray-800 text-sm font-medium">
                Book Appointment
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
