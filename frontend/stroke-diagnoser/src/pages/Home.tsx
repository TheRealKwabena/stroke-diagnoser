
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900 mb-6">
              Empowering Our Patients With Remote Healthcare Diagnosis
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with top specialists, explore personalized care, and experience a healthier life—all with just a few clicks.
            </p>
            <div className="flex space-x-4">
              <Link to="/form">
              <button className="bg-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-purple-600 flex items-center">
                Start Here
                <MoveRight className="ml-2 h-4 w-4" />
              </button>
              </Link>
              
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
                src="/lovable-uploads/doctor.jpg"
                alt="Medical Care"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
