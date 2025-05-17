import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { Heart, Droplets } from 'lucide-react';

// It's crucial to use an environment variable for the Client ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;

export function DonationSection() {
  const [donationAmount, setDonationAmount] = useState("10.00"); // Default amount
  const [amountError, setAmountError] = useState("");

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic validation: allows numbers, an optional decimal, and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setDonationAmount(value);
      setAmountError("");
    } else {
      // If you want to provide immediate feedback for invalid characters, you can do it here
      // For now, error is mainly for form submission or button disabling logic
    }
  };

  const validateAmountForOrder = () => {
    const numericAmount = parseFloat(donationAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setAmountError("Please enter a valid positive amount.");
      return false;
    }
    // You might want to add a minimum donation amount check here, e.g.,
    // if (numericAmount < 1.00) {
    //   setAmountError("Minimum donation is $1.00.");
    //   return false;
    // }
    setAmountError("");
    return true;
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

          {/* Amount Input */}
          <div className="mb-6">
            <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Donation Amount (USD)
            </label>
            <input
              type="text" // Using text to allow flexible input, validation handles correctness
              name="donationAmount"
              id="donationAmount"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={donationAmount}
              onChange={handleAmountChange}
              onBlur={validateAmountForOrder} // Validate when user leaves the input field
              placeholder="e.g., 25.00"
            />
            {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
          </div>

          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal", tagline: false }}
              fundingSource={FUNDING.PAYPAL}
              // The key prop helps React re-render PayPalButtons if the amount changes,
              // ensuring createOrder uses the latest amount.
              key={donationAmount + PAYPAL_CLIENT_ID} // Add client ID to key if it could change (e.g. sandbox vs live)
              createOrder={(data, actions) => {
                if (!validateAmountForOrder()) { // Re-validate just before creating order
                  // This error will be caught by PayPal's internal error handling for createOrder
                  return Promise.reject(new Error("Invalid donation amount."));
                }
                console.log("Creating order for amount:", donationAmount, initialOptions.currency);
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: donationAmount, // Use state variable
                        currency_code: initialOptions.currency,
                      },
                      description: "Donation for Clean Rivers Initiative",
                    },
                  ],
                  application_context: {
                    brand_name: 'Clean Rivers Initiative',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'DONATE'
                  }
                });
              }}
              onApprove={(data, actions) => {
                console.log("Order approved. Data:", data);
                // actions.order is optional, so we need to check if it exists.
                if (!actions.order) {
                    console.error("actions.order is undefined in onApprove. Cannot capture order.");
                    alert("There was an issue processing your donation. Order details could not be retrieved.");
                    return Promise.reject(new Error("actions.order is undefined"));
                }
                return actions.order.capture().then((details) => {
                  console.log('Transaction details:', details);
                  alert(`Transaction completed by ${details.payer.name.given_name}! Order ID: ${data.orderID}. Thank you for your donation of $${details.purchase_units[0].amount.value}!`);
                  // Optionally reset amount or navigate user
                  setDonationAmount("10.00"); // Reset to default or an empty string
                }).catch(err => {
                  console.error("Error capturing order:", err);
                  alert("There was an issue processing your donation. Please try again.");
                });
              }}
              onError={(err) => {
                console.error("PayPal Checkout onError", err);
                // Check if the error object has more details, e.g., err.message
                const errorMessage = err && typeof err === 'object' && 'message' in err ? String(err.message) : "An unknown error occurred.";
                alert(`An error occurred with your PayPal donation: ${errorMessage} Please try again or contact support.`);
                if (String(err).includes("COUNTRY_NOT_SUPPORTED")) {
                    setAmountError("The currency or country is not supported for this transaction.");
                } else if (String(err).includes("Expected an order id to be passed")) {
                    setAmountError("Could not initiate PayPal transaction. Please check the amount and try again.");
                }
              }}
              onCancel={(data) => {
                console.log("PayPal Checkout onCancel", data);
                alert("Your donation was cancelled.");
              }}
              // Disable button if amount is invalid or not entered
              disabled={!donationAmount || !!amountError || parseFloat(donationAmount) <= 0}
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