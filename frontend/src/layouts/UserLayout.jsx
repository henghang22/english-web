import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
