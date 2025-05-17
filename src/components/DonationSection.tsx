import React from 'react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { Heart, Droplets } from 'lucide-react';

// It's crucial to use an environment variable for the Client ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;

export function DonationSection() {
  if (!PAYPAL_CLIENT_ID) {
    console.error("PayPal Client ID is not set. Please set VITE_APP_PAYPAL_CLIENT_ID in your .env file.");
    return (
      <section className="py-16 bg-blue-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Make a Difference Today</h2>
            <p className="text-gray-600">Donation system is currently unavailable. Please check back later.</p>
            <p className="text-sm text-red-500 mt-2">PayPal Client ID not configured.</p>
          </div>
        </div>
      </section>
    );
  }

  const initialOptions = {
    "clientId": PAYPAL_CLIENT_ID,
    currency: "USD", // You can change this to your preferred currency
    intent: "capture", // "capture" processes the payment immediately, "authorize" reserves it
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Make a Difference Today</h2>
            <p className="text-gray-600">Your donation helps us remove more plastic from our rivers</p>
          </div>

          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal", tagline: false }}
              fundingSource={FUNDING.PAYPAL} // Ensures only PayPal button shows. Remove for other funding sources.
              createOrder={(data, actions) => {
                // For now, let's use a fixed donation amount.
                // You can enhance this to take user input for the amount.
                const donationAmount = "10.00"; // Example: $10.00 
                console.log("Creating order for amount:", donationAmount, initialOptions.currency);
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: donationAmount,
                        currency_code: initialOptions.currency,
                      },
                      description: "Donation for Clean Rivers Initiative",
                    },
                  ],
                  application_context: {
                    brand_name: 'Clean Rivers Initiative',
                    shipping_preference: 'NO_SHIPPING', // Important for donations
                    user_action: 'DONATE' 
                  }
                });
              }}
              onApprove={(data, actions) => {
                console.log("Order approved. Data:", data);
                return actions.order.capture().then((details) => {
                  console.log('Transaction details:', details);
                  alert(`Transaction completed by ${details.payer.name.given_name}! Order ID: ${data.orderID}. Thank you for your donation!`);
                  // IMPORTANT: For production, you should verify the transaction on your server-side.
                  // Send 'data.orderID' or 'details.id' to your backend for verification.
                }).catch(err => {
                  console.error("Error capturing order:", err);
                  alert("There was an issue processing your donation. Please try again.");
                });
              }}
              onError={(err) => {
                console.error("PayPal Checkout onError", err);
                alert("An error occurred with your PayPal donation. Please try again or contact support.");
              }}
              onCancel={(data) => {
                console.log("PayPal Checkout onCancel", data);
                alert("Your donation was cancelled.");
              }}
            />
          </PayPalScriptProvider>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Droplets className="inline-block w-4 h-4 mr-1" />
            100% of donations go directly to river cleanup efforts
          </div>
          <div className="mt-4 text-center text-xs text-gray-400">
            Secure payments by PayPal. Your PayPal Secret Key is NOT used in this frontend integration.
          </div>
        </div>
      </div>
    </section>
  );
}