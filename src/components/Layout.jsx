import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '280px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
