import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

const useOrders = () => {
  const [ordersState, setOrdersState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user-orders");
      setOrdersState({ data: data.orders, loading: false, error: null });
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersState({ data: [], loading: false, error: "Failed to load orders" });
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return ordersState;
};

export default useOrders;
