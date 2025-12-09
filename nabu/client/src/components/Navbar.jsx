import React from 'react';
import ProfileBlurb from './ProfileBlurb';

const Navbar = () => {
  return (
    <header className="site-header">
      <div className="container header-content">
        {/* Logo and Game Name on the left */}
        <a href="/#/dashboard" className="header-logo-link">
          <img
            src="/icons/nabu.png"
            alt="NABU Logo"
            className="header-logo-img"
          />
          {/* App name added next to the logo */}
          <span className="header-app-name">NABU</span>
        </a>

        <span> <ProfileBlurb/> </span>
      </div>
    </header>
  );
};

export default Navbar;