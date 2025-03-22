import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default registerSchema;
