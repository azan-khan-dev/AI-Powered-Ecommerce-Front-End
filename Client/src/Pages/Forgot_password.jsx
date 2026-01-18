import React, { useState } from "react";
import { AiOutlineMail, AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useForgetPasswordMutation } from "../redux/apis/authApis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgetPassword({ email }).unwrap();
      if (res.success) {
        setIsSent(true);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {!isSent ? (
          <form
            onSubmit={handleEmailSubmit}
            className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6"
          >
            <div className="flex justify-center">
              <AiOutlineMail className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Forgot your password?
            </h2>
            <p className="text-center text-sm text-gray-600">
              No worries! Enter your email address and we'll send you a password reset link.
            </p>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-4"
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="mt-5 text-center cursor-pointer">
              <button
                onClick={() => navigate("/login")}
                type="button"
                className="cursor-pointer relative flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-gray-600 group hover:text-white transition-all duration-300 mx-auto overflow-hidden rounded-md"
              >
                <IoIosArrowBack className="w-4 h-4 z-10" />
                <span className="z-10">Back to Login</span>
                <span className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-red-600 to-red-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out rounded-md z-0" />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg shadow-md space-y-6 text-center">
            <div className="flex justify-center">
              <AiOutlineCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-600">
              We have sent a password reset link to <strong>{email}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Check your spam folder if you don't see the email within a few minutes.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Resend Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
