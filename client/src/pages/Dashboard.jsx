import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import Navbar from "./Navbar";
import CartBox from "../components/CartBox";
import api from "../api/api";

const categories = ["All", "Electronics", "Clothing", "Accessories"];

const Home = () => {
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    price: 5000,
  });
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Compute total cart items
  const totalCartItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // Fetch Products (only once)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products");
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Optimized Filtering Logic with useMemo
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (filters.category === "All" || product.category === filters.category) &&
        product.price <= filters.price
    );
  }, [search, filters, products]);

  // Handle Filter Change
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar setCartOpen={setCartOpen} totalCartItems={totalCartItems} />

      {/* Search & Filter Section */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm"
        />

        <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="p-2 border rounded-md w-full sm:w-1/2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700">
              Price: ₹{filters.price}
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              value={filters.price}
              onChange={(e) => handleFilterChange("price", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isInCart = cartItems.some((item) => item._id === product._id);

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-600">Category: {product.category}</p>
                <p className="text-gray-600">Price: ₹{product.price}</p>

                <button
                  onClick={() =>
                    isInCart
                      ? dispatch(removeFromCart(product._id))
                      : dispatch(addToCart(product))
                  }
                  className={`mt-3 w-full py-2 rounded-md text-white ${
                    isInCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        )}
      </div>

      {/* Show Cart Sidebar when Open */}
      {cartOpen && <CartBox onClose={() => setCartOpen(false)} />}
    </div>
  );
};

export default Home;
