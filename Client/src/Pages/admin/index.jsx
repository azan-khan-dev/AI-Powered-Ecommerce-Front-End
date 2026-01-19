import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Payments from './pages/Payments';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (user?.role !== "admin") {
    navigate("/")
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'users':
        return <Users />;
      case 'payments':
        return <Payments />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default Admin;
