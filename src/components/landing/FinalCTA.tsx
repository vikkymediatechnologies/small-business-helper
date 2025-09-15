import React from 'react';
import { ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, text: 'Secure & Reliable' },
    { icon: Users, text: '5,000+ Happy Users' },
    { icon: TrendingUp, text: 'Boost Your Profits' }
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stop Losing Money.<br />
            Start Running Your Shop Like a Pro Today.
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Join thousands of Nigerian business owners who've transformed their operations. 
            No more paper books, no more lost sales, no more forgotten debts.
          </p>

          <div className="flex justify-center gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-blue-100">
                <feature.icon className="h-5 w-5" />
                <span className="hidden sm:block">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <button 
              onClick={() => navigate('/app')}
              className="bg-white text-blue-600 px-12 py-5 rounded-xl hover:bg-gray-50 transition-colors font-bold text-xl shadow-2xl hover:shadow-3xl flex items-center gap-3 mx-auto"
            >
              Create Free Account Now
              <ArrowRight className="h-6 w-6" />
            </button>
            
            <p className="text-blue-200 mt-6 text-lg">
              ✅ No credit card required • ✅ Setup in 2 minutes • ✅ Cancel anytime
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Free to Start</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;