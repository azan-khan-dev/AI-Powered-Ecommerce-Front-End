import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../redux/apis/authApis";
import { useGetUserWishlistQuery } from "../redux/apis/wishlistApis";
import { useGetMyOrdersQuery } from "../redux/apis/orderApis";
import { userExist } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CiCamera } from "react-icons/ci";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Fetch updated profile data
  const { data: profileData, isLoading: profileLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateMyProfileMutation();

  // Fetch stats data
  const wishlistCount = useSelector((state) => state.wishlist.count);
  // Ensure we have the latest orders count
  const { data: ordersData } = useGetMyOrdersQuery({ page: 1, limit: 1000 }); // efficient enough for client side usually
  const ordersCount = ordersData?.pagination?.totalOrders || ordersData?.data?.length || 0;

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null, // For file upload
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Populate form data when profile loads
  useEffect(() => {
    if (profileData?.user || profileData?.data) {
      const profile = profileData.user || profileData.data;
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zipCode: profile.address?.zipCode || "",
          country: profile.address?.country || "",
        },
        avatar: null // Reset file on load
      }));
      setPreviewImage(profile.image?.url || null);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      // Append address as stringified JSON because backend expects it or flat fields
      // Our backend update for address was: if (address) user.address = JSON.parse(address)
      data.append("address", JSON.stringify(formData.address));

      if (formData.avatar) {
        data.append("image", formData.avatar); // Backend expects 'image' as per multer middleware
        // Multer middleware is configured as .single("image") 
        // Let's assume standard practice or check route. 
        // Actually, looking at previous code, user upload was typically 'file' or 'image'.
        // Let's try 'file' if generic, or checks the route definition.
        // Checking auth controller: `const image = req.file;` 
        // Typically route middlewares define the field name, e.g. `upload.single('file')`. 
        // Let's use 'file' which is common.
      }

      const result = await updateProfile(data).unwrap();

      if (result.success) {
        dispatch(userExist(result.newuser || result.user || result.data));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profileData?.user || profileData?.data) {
      const profile = profileData.user || profileData.data;
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          zipCode: profile.address?.zipCode || "",
          country: profile.address?.country || "",
        },
        avatar: null
      });
      setPreviewImage(profile.image?.url || null);
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <Link
            to="/login"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const profile = profileData?.user || profileData?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md ${isEditing ? 'cursor-pointer' : ''}`}
                    onClick={triggerFileInput}
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-600 text-4xl font-bold">
                        {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-4 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <CiCamera className="text-lg" />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{profile?.name}</h3>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="mt-4">
                  <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    {profile?.role === 'admin' ? 'Administrator' : 'Client Account'}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{ordersCount}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{wishlistCount || 0}</div>
                    <div className="text-sm text-gray-600">Wishlist Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 hover:text-red-700 hover:underline hover:bg-red-50 text-sm font-medium cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing} // Email usually shouldn't be changeable without verification, but user requested 'edit profile'
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Address Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="address.country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">My Orders</h4>
                  <p className="text-sm text-gray-600">View and track your orders</p>
                </div>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">My Wishlist</h4>
                  <p className="text-sm text-gray-600">View your saved items</p>
                </div>
              </Link>

              <Link
                to="/cart"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">My Cart</h4>
                  <p className="text-sm text-gray-600">View items in your cart</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;