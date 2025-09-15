import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Adebayo Okafor',
      role: 'Shop Owner, Lagos',
      content: 'Before, I lost track of debts and never knew my real profit. Now I know who owes me and my stock balance daily. This app is a life saver!',
      rating: 5,
      image: '👨🏿‍💼'
    },
    {
      name: 'Fatima Ibrahim',
      role: 'POS Agent, Kano',
      content: 'The WhatsApp receipts make me look so professional! My customers love getting instant receipts and I never forget to follow up on debts.',
      rating: 5,
      image: '👩🏿‍💼'
    },
    {
      name: 'Chinedu Okeke',
      role: 'Trader, Onitsha Market',
      content: 'I used to spend hours counting stock. Now everything is automated and I get alerts when items are low. My business runs smoother than ever.',
      rating: 5,
      image: '👨🏿‍💼'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of business owners who have transformed their operations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative">
              <Quote className="h-8 w-8 text-blue-200 mb-4" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-full px-6 py-3 inline-flex items-center space-x-2 shadow-lg">
            <div className="flex -space-x-2">
              {['👨🏿‍💼', '👩🏿‍💼', '👨🏿‍💼', '👩🏿‍💼'].map((emoji, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm border-2 border-white">
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-gray-700 font-medium">Join 5,000+ happy users</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;