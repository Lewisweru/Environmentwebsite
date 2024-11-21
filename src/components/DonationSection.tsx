import React from 'react';
import { Heart, Droplets } from 'lucide-react';

const PAYPAL_DONATION_LINK = "https://www.paypal.com/donate?hosted_button_id=HUP4AU35UC6Q6";

export function DonationSection() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
            <p className="text-gray-600">Your donation helps us remove more plastic from our rivers</p>
          </div>

          <a 
            href={PAYPAL_DONATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <button className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
              <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="PayPal" className="h-6" />
              Donate with PayPal
            </button>
          </a>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Droplets className="inline-block w-4 h-4 mr-1" />
            100% of donations go directly to river cleanup efforts
          </div>
        </div>
      </div>
    </section>
  );
}