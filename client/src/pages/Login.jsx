import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import loginSchema from "../validation/loginSchema"; // ✅ Yup validation
import api from "../api/api"; // ✅ Import Axios instance

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await api.post("/auth/login", values); // ✅ Send API request
      console.log("Login Success:", response.data);
      alert("Login successful!");
      navigate("/home"); // Redirect to Home page after login
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response.data.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <Field type="email" name="email" className="w-full p-2 border border-gray-300 rounded mt-1" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <Field type="password" name="password" className="w-full p-2 border border-gray-300 rounded mt-1" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
