import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const siteSettings = useSelector((state) => state.settings.siteSettings);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4 max-w-full">
        <div className="flex items-center">
          <h1 className="text-3xl font-semibold text-gray-900 m-0">Welcome Back {siteSettings?.siteName}</h1>
        </div>




      </div>

    </header>
  );
};

export default Header;
