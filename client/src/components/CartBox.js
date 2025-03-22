import { useEffect, useState, useCallback, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import CheckoutForm from "./CheckoutForm";
import { FaTrash, FaTimes } from "react-icons/fa";
import { removeFromCart } from "../redux/cartSlice";

const stripePromise = loadStripe(
  "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
);

const CartBox = ({ onClose }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  // Use useMemo to optimize total price calculation
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Use useCallback to memoize fetchClientSecret function
  const fetchClientSecret = useCallback(async () => {
    if (totalPrice <= 0 || clientSecret) return; // Avoid unnecessary API calls

    try {
      const response = await api.post("/api/create-payment-intent", {
        amount: Math.round(totalPrice * 100),
        items: cartItems,
      });

      console.log("✅ Received clientSecret:", response.data.clientSecret);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("❌ Error fetching clientSecret:", error);
    }
  }, [totalPrice, cartItems, clientSecret]);

  useEffect(() => {
    if (checkout) {
      fetchClientSecret();
    }
  }, [checkout, fetchClientSecret]);

  // Memoized Cart Head to prevent unnecessary re-renders
  const CartHead = useMemo(
    () => (
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold">🛒 Your Cart</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          <FaTimes size={22} />
        </button>
      </div>
    ),
    [onClose]
  );

  return !clientSecret ? (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 p-5 overflow-y-auto transition-transform transform translate-x-0">
      {CartHead}
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1 ml-3">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-600">x{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
            <p>Total:</p>
            <p>₹{totalPrice.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            onClick={() => setCheckout(true)}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  ) : (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 p-5 overflow-y-auto transition-transform transform translate-x-0">
        {CartHead}
        <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
          <p>Total:</p>
          <p>₹{totalPrice.toFixed(2)}</p>
        </div>
        <div className="mt-4 flex justify-between items-center mb-4 border-b pb-2">
          <CheckoutForm
            totalPrice={totalPrice}
            cartItems={cartItems}
            clientSecret={clientSecret}
          />
        </div>
      </div>
    </Elements>
  );
};

export default CartBox;
