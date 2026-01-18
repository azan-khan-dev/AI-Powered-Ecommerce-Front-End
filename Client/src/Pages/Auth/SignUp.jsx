import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { IoEyeOffOutline } from "react-icons/io5";
import { useSignupMutation } from "../../redux/apis/authApis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userExist } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
function Signup()
{
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // RTK Query Mutation Hook
  const [signup, { isLoading }] = useSignupMutation();

  const handleChange = (e) =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () =>
  {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 4)
      newErrors.name = "Name must be at least 4 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = "Password must contain at least one number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      newErrors.password = "Password must contain at least one special character";

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
        const response = await signup(formData).unwrap();
        if (response?.user || response?.data)
        {
          dispatch(userExist(response?.user || response?.data));
        }
        toast.success("Signup successful! 🎉");
      } catch (error)
      {
        toast.error(error?.data?.message || "Signup failed!");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white mt-10">
      {/* Left Image */}
      <div className="hidden md:flex md:w-1/2 min-h-screen border-r border-gray-100">
        <img
          className="mt-10 h-[80vh] w-full object-cover object-left"
          src="https://img.freepik.com/premium-photo/empty-black-smart-phone-with-cart-bags-light-background-online-shopping-purchase-concept-mock-up-3d-rendering_670147-10275.jpg"
          alt="signup"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-4 py-10">
        <form className="w-full max-w-sm -mt-20" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-semibold">Create an account</h1>
          <p className="pt-2 text-gray-600">Enter your details below</p>

          <div className="flex flex-col pt-8 space-y-8">
            {/* NAME */}
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 py-2 peer focus:outline-none focus:border-b-transparent"
              />
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 peer-focus:w-full transition-all"></div>
              {errors.name && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {errors.name}
                </span>
              )}
            </div>

            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 py-2 peer focus:outline-none focus:border-b-transparent"
              />
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 peer-focus:w-full transition-all"></div>
              {errors.email && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 py-2 pr-10 peer focus:outline-none focus:border-b-transparent"
              />
              <div
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
              >
                {showPassword ? <LuEye size={22} /> : <IoEyeOffOutline size={22} />}
              </div>
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 peer-focus:w-full transition-all"></div>
              {errors.password && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col pt-10 space-y-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create an Account"}
            </button>

            

            <p className="text-center text-gray-700">
              Already have an account?
              <Link
                to="/login"
                className="text-red-600 px-2 py-1 hover:bg-red-600 hover:text-white rounded"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
