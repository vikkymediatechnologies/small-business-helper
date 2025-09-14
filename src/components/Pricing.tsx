import React from 'react';
import { Check, Crown } from 'lucide-react';

const Pricing = () => {
  const freeFeatures = [
    'Record sales',
    'Track stock',
    'Debt list',
    'Basic reports'
  ];

  const proFeatures = [
    'Cloud backup',
    'Receipts (PDF & WhatsApp)',
    'Profit & expense reports',
    'Multi-user access',
    'WhatsApp reminders',
    'Low stock alerts',
    'Customer payment reminders'
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade when you're ready for advanced features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-50 rounded-2xl p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">₦0</div>
              <p className="text-gray-600">Perfect to get started</p>
            </div>

            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
              Start Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 relative border-2 border-blue-200">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">₦2,000</div>
              <p className="text-gray-600 mb-2">per month</p>
              <p className="text-sm text-blue-600 font-semibold">Save ₦4,000 with yearly plan (₦20,000/year)</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="text-gray-700 font-medium">Everything in Free, plus:</li>
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include customer support • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;