import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../../redux/apis/settingsApis';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../../redux/apis/authApis';
import { toast } from 'react-toastify';

const Settings = () => {
  // Site Settings Logic
  const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();

  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    currency: 'USD',
    timezone: 'UTC',
    maintenanceMode: false
  });

  useEffect(() => {
    if (settingsData?.data) {
      setSiteSettings({
        siteName: settingsData.data.siteName || '',
        siteDescription: settingsData.data.siteDescription || '',
        contactEmail: settingsData.data.contactEmail || '',
        contactPhone: settingsData.data.contactPhone || '',
        currency: settingsData.data.currency || 'USD',
        timezone: settingsData.data.timezone || 'UTC',
        maintenanceMode: settingsData.data.maintenanceMode || false
      });
    }
  }, [settingsData]);

  const handleSiteSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(siteSettings).unwrap();
      toast.success('Site settings updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update settings');
    }
  };

  // Profile Settings Logic
  const { data: profileData, isLoading: profileLoading } = useGetMyProfileQuery(); // Assuming this API exists and works
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();

  const [profileSettings, setProfileSettings] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profileData?.data) {
      setProfileSettings(prev => ({
        ...prev,
        name: profileData.data.name || '',
        email: profileData.data.email || '',
        avatar: profileData.data.image?.url || '',
      }));
    }
  }, [profileData]);

  const handleProfileSettingsChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfileSettings = async (e) => {
    e.preventDefault();
    if (profileSettings.newPassword && profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profileSettings.name);
      formData.append('email', profileSettings.email);
      // Only append password if provided
      if (profileSettings.newPassword) {
        // Assuming backend handles password update via same endpoint, otherwise need separate logic
        // Usually profile update doesn't handle password directly without current password verification
        // For now, let's assume simple profile update or add logic later if needed.
        // Based on auth controller, updateMyProfile handles basic fields.
        // Password update is typically separate. We'll skip password here for now or warn user.
        toast.error("Password update requires a separate process (not yet implemented fully in this form).");
        return;
      }

      const res = await updateProfile({
        name: profileSettings.name,
        email: profileSettings.email,
        // Add other fields if supported by backend updateMyProfile
      }).unwrap();

      toast.success('Profile settings updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (settingsLoading || profileLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 m-0">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Site Settings Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="w-fit text-2xl font-semibold bg-black text-white mb-6 px-4 py-2 rounded-md">Site Settings</h2>
          <form onSubmit={handleSaveSiteSettings} className="space-y-6">
            <div>
              <label htmlFor="siteName" className="block text-lg font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={siteSettings.siteName}
                onChange={handleSiteSettingsChange}
                className="input-field w-full lg:w-80 px-4 py-2 text-base border border-gray-300 rounded-lg transition-all duration-200 hover:border-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-lg font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={siteSettings.siteDescription}
                onChange={handleSiteSettingsChange}
                rows="3"
                className="input-field resize-vertical w-full lg:w-80 px-4 py-2 text-base border border-gray-300 rounded-lg transition-all duration-200 hover:border-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactEmail" className="block text-lg font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={siteSettings.contactEmail}
                  onChange={handleSiteSettingsChange}
                  className="input-field w-full lg:w-80 px-4 py-2 text-base border border-gray-300 rounded-lg transition-all duration-200 hover:border-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-lg font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={siteSettings.contactPhone}
                  onChange={handleSiteSettingsChange}
                  className="input-field w-full lg:w-80 px-4 py-2 text-base border border-gray-300 rounded-lg transition-all duration-200 hover:border-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-lg font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={siteSettings.currency}
                  onChange={handleSiteSettingsChange}
                  className="input-field px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="PKR">PKR (Rs)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-lg font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={siteSettings.timezone}
                onChange={handleSiteSettingsChange}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={siteSettings.maintenanceMode}
                onChange={handleSiteSettingsChange}
                className="w-4 h-4 accent-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-lg font-medium text-gray-700">
                Maintenance Mode
              </label>
            </div>

            <button
              type="submit"
              disabled={isUpdatingSettings}
              className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors duration-300 disabled:bg-red-400"
            >
              {isUpdatingSettings ? 'Saving...' : 'Save Site Settings'}
            </button>
          </form>
        </div>

        {/* Profile Settings Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="w-fit text-2xl font-semibold bg-black text-white mb-6 px-4 py-2 rounded-md">
            Profile Settings
          </h2>

          <form onSubmit={handleSaveProfileSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="profileName" className="block text-lg font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="profileName"
                  name="name"
                  value={profileSettings.name}
                  onChange={handleProfileSettingsChange}
                  className="input-field w-full lg:w-80 px-4 py-2 text-base border border-gray-300 rounded-lg transition-all duration-200 hover:border-red-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="profileEmail" className="block text-lg font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="profileEmail"
                  name="email"
                  value={profileSettings.email}
                  disabled // Usually verify before change
                  className="input-field w-full lg:w-80 px-4 py-2 text-base border border-gray-200 bg-gray-100 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={profileSettings.avatar || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=User'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <button type="button" className="btn-secondary bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors duration-300">
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Password Change Section - Placeholder as it might need separate flow */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                To change your password, please use the "Forgot Password" flow or contact system administrator.
              </div>
            </div>

            <button type="submit" disabled={isUpdatingProfile} className="btn-primary bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors duration-300 disabled:bg-red-400">
              {isUpdatingProfile ? 'Saving...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;


