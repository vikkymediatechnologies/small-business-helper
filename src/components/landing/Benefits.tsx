import React from 'react';
import { Clock, Users, BarChart3 } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Record Sales in Seconds',
      description: 'Quick entry for every transaction. No more writing in books or losing track of sales.'
    },
    {
      icon: Users,
      title: 'Track Debts & Customers',
      description: 'Keep customer records and debt status organized. Never forget who owes you money.'
    },
    {
      icon: BarChart3,
      title: 'Get Reports Anytime',
      description: 'Daily, weekly, and monthly sales reports at your fingertips. Make better business decisions.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Small Business Owners Love Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to run your business professionally, without the complexity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <benefit.icon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;