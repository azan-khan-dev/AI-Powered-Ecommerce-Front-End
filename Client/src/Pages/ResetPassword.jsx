import React, { useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/apis/authApis";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            const res = await resetPassword({ token, password, confirmPassword }).unwrap();
            if (res.success) {
                toast.success(res.message);
                navigate("/login");
            }
        } catch (err) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6"
                >
                    <div className="flex justify-center">
                        <BsShieldLock className="w-13 h-13 text-red-500 text-5xl" />
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-900">
                        Reset your Password
                    </h2>
                    <p className="text-center text-sm text-gray-600">
                        Enter your new password below.
                    </p>

                    {/* New Password */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div
                            className="absolute top-8 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <IoEyeOutline className="w-5 h-5 text-gray-500" />
                            ) : (
                                <IoEyeOffOutline className="w-5 h-5 text-gray-500" />
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div
                            className="absolute top-8 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <IoEyeOutline className="w-5 h-5 text-gray-500" />
                            ) : (
                                <IoEyeOffOutline className="w-5 h-5 text-gray-500" />
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
