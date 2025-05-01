
import { useState } from 'react';
import { MoveRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleOpenAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleNavigateToUserDashboard = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'Patient':
        window.location.href = '/patient-dashboard';
        break;
      case 'Doctor':
        window.location.href = '/doctor-dashboard';
        break;
      case 'Neurologist':
        window.location.href = '/neurologist-dashboard';
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900 mb-6">
              Empowering Wellness with Advanced Care
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with top specialists, explore personalized care, and experience a healthier life—all with just a few clicks.
            </p>
            <div className="flex space-x-4">
              {user ? (
                <Button 
                  className="bg-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-purple-600 flex items-center"
                  onClick={handleNavigateToUserDashboard}
                >
                  Go to Dashboard
                  <MoveRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    className="bg-white border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-medium hover:border-gray-300"
                    onClick={handleOpenAuthModal}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-purple-600 flex items-center"
                    onClick={handleOpenAuthModal}
                  >
                    Sign Up Now
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="mt-12">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <span className="ml-4 text-sm font-medium text-gray-600">
                  50K+ Patients Trust Us
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <img
                src="/lovable-uploads/e84e0cf3-54b5-4bd7-b5f8-3f5585afa781.png"
                alt="Medical Care"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </div>
  );
};

export default Home;
