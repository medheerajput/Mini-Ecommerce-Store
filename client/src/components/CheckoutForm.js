import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { clearCart } from "../redux/cartSlice"; // Uncommented to clear cart after payment
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ totalPrice, cartItems, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements || !clientSecret) {
      alert("❌ Stripe is not initialized or clientSecret is missing!");
      return;
    }
  
    setLoading(true);
  
    try {
      const { error } = await elements.submit();
      if (error) throw new Error(error.message);
  
      console.log("✅ Confirming Payment with clientSecret:", clientSecret);
  
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: window.location.origin,
          payment_method_data: {
            billing_details: {
              name: "John Doe", // 🛠️ Replace with actual user name
              email: "johndoe@example.com", // 🛠️ Replace with actual user email
              address: {
                line1: "123 Main Street",
                city: "Mumbai",
                state: "MH",
                postal_code: "400001",
                country: "IN",
              },
            },
          },
        },
        redirect: "if_required",
      });
  
      if (confirmError) throw new Error(confirmError.message);
  
      if (paymentIntent?.status === "succeeded") {
        await api.post("/api/create-order", {
          items: cartItems,
          totalAmount: totalPrice,
          paymentIntentId: paymentIntent.id,
        });
  
        alert(`✅ Payment of ₹${totalPrice.toFixed(2)} successful!`);
        dispatch(clearCart()); // Clears cart after successful payment
        navigate("/user-orders");
      }
    } catch (err) {
      console.error("❌ Payment failed:", err.message);
      alert("❌ Payment failed: " + err.message);
    }
  
    setLoading(false);
  };
  
  
  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay ₹${totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
