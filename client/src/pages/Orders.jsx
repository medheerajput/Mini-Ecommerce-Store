import moment from "moment";
import useOrders from "../hooks/useOrders.js";

const Orders = () => {
  const { data: orders, loading, error } = useOrders();

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-600",
      paid: "bg-green-100 text-green-600",
      shipped: "bg-blue-100 text-blue-600",
      delivered: "bg-purple-100 text-purple-600",
      canceled: "bg-red-100 text-red-600",
    };

    return (
      <span className={`px-4 py-1 mt-2 inline-block text-sm font-medium rounded-full ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  if (loading) return <p className="text-center text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-y-auto max-h-[450px] space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-50 border border-gray-300 shadow-md rounded-md p-5 flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition duration-300">
                {/* Order Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order ID: <span className="text-blue-600 font-mono">{order._id}</span>
                  </h3>
                  <p className="text-gray-500 text-sm">Ordered {moment(order.createdAt).fromNow()}</p>
                  <p className="text-gray-700 font-semibold mt-1">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order Items */}
                <div className="flex space-x-4 overflow-x-auto max-w-[300px] md:max-w-[400px] p-2">
                  {order.items.map((item) => (
                    <div key={item.productId._id} className="flex flex-col items-center bg-white shadow rounded-md p-2 min-w-[100px]">
                      <img src={item.productId.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <p className="text-xs font-medium text-gray-700 text-center">{item.name} × {item.quantity}</p>
                      <p className="text-gray-600 text-xs">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
