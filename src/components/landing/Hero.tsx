import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/app');
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Run Your Shop <span className="text-blue-600">Smarter</span> – Track Sales, Stock & Debts Easily
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            No more paper books. Manage your business from your phone with Small Business Helper.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={handleStartFree}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Free
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center gap-2">
              <Play className="h-5 w-5" />
              See How It Works
            </button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-full shadow-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <p className="text-gray-600 font-medium">Shop owner managing business on phone</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              100% Free to Start
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;