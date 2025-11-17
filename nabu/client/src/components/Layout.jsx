import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; // Import the Navbar

/**
 * This is the main Layout component for the site.
 * It creates the "frame" that all pages sit inside.
 * * It renders:
 * 1. The <Navbar /> at the top.
 * 2. The <Outlet />, which is the current page (Home, Login, etc.)
 */
export const Layout = () => {
  return (
    // This wrapper is used to make the layout fill the screen
    <div className="app-layout-wrapper"> 
      <Navbar />
      <Outlet />
    </div>
  );
};