import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600">
      <Header />

      {/* Main Content with top padding for fixed header */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
        <Footer />
    </div>
  );
};

export default GuestLayout;
