import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setCartOpen, totalCartItems }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Mini-Ecommerce-Store</h1>
 
      {/* Buttons Container */}
      <div className="flex items-center gap-4">
        {/* Order Button */}
        <button
          onClick={() => navigate("/user-orders")}
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 shadow-md"
        >
          Orders
        </button>

        {/* Cart Icon */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative bg-white text-blue-600 p-3 rounded-full hover:bg-gray-200 w-12 h-12 flex items-center justify-center shadow-md"
        >
          <FaShoppingCart className="text-xl" />

          {/* Cart Count Badge */}
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
