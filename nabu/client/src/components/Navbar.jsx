import React from 'react';
import ProfileBlurb from './ProfileBlurb';

const Navbar = () => {
  return (
    // The main header element, styled with the new gradient
    <header className="site-header">
      <div className="container header-content">
        {/* Logo and Game Name on the left */}
        <a href="/#" className="header-logo-link">
          <img
            src="/icons/nabu.png" // Correct path from your /public/icons folder
            alt="NABU Logo"
            className="header-logo-img"
          />
          {/* App name added next to the logo */}
          <span className="header-app-name">NABU</span>
        </a>

        <span> <ProfileBlurb/> </span>

        {/* Navigation Links on the right (REMOVED) */}
        {/* You can add links back here later if you need them */}
      </div>
    </header>
  );
};

export default Navbar;