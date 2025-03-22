import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import CartBox from "./components/CartBox";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protecting Dashboard */}
        <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartBox /></ProtectedRoute>} />
        <Route path="/user-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
