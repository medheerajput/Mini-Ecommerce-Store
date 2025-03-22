import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import registerSchema from "../validation/registerSchema"; // ✅ Import Yup validation
import api from "../api/api"; // ✅ Import Axios instance

const Register = () => {
  const navigate = useNavigate()
  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await api.post("/auth/register", values); // ✅ Send request
      console.log("Register Success:", response.data);
      alert("Registration successful!");
      navigate("/")
      resetForm();
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      alert(error.response.data.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-green-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
