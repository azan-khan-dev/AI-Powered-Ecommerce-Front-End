import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdPayment } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
    { id: 'orders', label: 'Orders', icon: <MdOutlineShoppingCart /> },
    { id: 'payments', label: 'Payments', icon: <MdPayment /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'settings', label: 'Settings', icon: <IoMdSettings /> }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sticky  top-0 left-0 w-64 bg-gradient-to-b from-gray-100 to-gray-200 text-black flex flex-col shadow-lg z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="py-8 p-5 pb-4 border-b border-black/10">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-10">
          <ul className="list-none m-0 p-0">
            {menuItems.map(item => (
              <li key={item.id} className="mb-1">
                <button
                  className={`flex items-center w-full px-5 py-3 text-left 
    rounded-r-2xl mr-2 transition-all duration-300
    ${currentPage === item.id
                      ? 'bg-black text-white shadow-lg'
                      : 'text-black/80 hover:ring-2 hover:ring-black hover:bg-transparent'
                    }`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="mr-3 text-lg w-5 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>


              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Toggle Button (float outside sidebar when closed) */}
      <div className={`md:hidden fixed top-40 z-50 transition-all duration-300 ${isOpen ? 'left-64' : 'left-0'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-black p-2 bg-white rounded-r shadow-lg"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
