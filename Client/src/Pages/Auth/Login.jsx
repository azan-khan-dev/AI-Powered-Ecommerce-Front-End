import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { IoEyeOffOutline } from "react-icons/io5";
import { useLoginMutation } from "../../redux/apis/authApis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userExist } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function Login()
{
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Professional Validation
  const validate = () =>
  {
    let newErrors = {};

    // Email validation
    if (!formData.email.trim())
    {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password)
    {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8)
    {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[0-9]/.test(formData.password))
    {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
    {
      newErrors.password = "Password must contain at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    if (validate())
    {
      try
      {
        const response = await login(formData).unwrap();
        if (response?.user || response?.data)
        {
          dispatch(userExist(response?.user || response?.data));
        }
        toast.success(response.message || "Login Successful!");
        navigate("/");
      } catch (error)
      {
        toast.error(error?.data?.message || "Login Failed!");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white mt-10">
      {/* Left Image Section */}
      <div className="hidden md:flex md:w-1/2 min-h-screen border-r border-gray-100 items-start justify-start">
        <img
          className="mt-10 h-[80vh] w-full object-cover object-left"
          src="https://img.freepik.com/premium-photo/empty-black-smart-phone-with-cart-bags-light-background-online-shopping-purchase-concept-mock-up-3d-rendering_670147-10275.jpg?semt=ais_hybrid&w=740"
          alt="login"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <form className="w-full max-w-sm -mt-20" onSubmit={handleSubmit}>
          {/* Heading */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-center md:text-left">
              Login to Smart Vision
            </h1>
            <p className="pt-3 text-center md:text-left text-gray-600">
              Enter your details below
            </p>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col pt-8 space-y-6">
            {/* Email */}
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="text-md font-quicksand font-medium w-full border-b-2 border-gray-300 py-2 focus:outline-none focus:border-b-transparent peer"
              />
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 peer-focus:w-full transition-all duration-300"></div>
              {errors.email && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="text-md font-quicksand font-medium w-full border-b-2 border-gray-300 py-2 pr-10 focus:outline-none focus:border-b-transparent peer"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
              >
                {showPassword ? <LuEye size={23} /> : <IoEyeOffOutline size={23} />}
              </div>
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 peer-focus:w-full transition-all duration-300"></div>
              {errors.password && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-[130px] sm:w-[140px] md:w-[130px] bg-red-600 hover:bg-red-700 text-white text-lg p-3 rounded cursor-pointer transition-colors duration-200"
              >
                Log In
              </button>
              <Link
                to="/forgot-password"
                className="text-red-600 font-semibold cursor-pointer hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Signup Link */}
            <p className="text-gray-700 text-base text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
