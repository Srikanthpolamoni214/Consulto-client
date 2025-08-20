import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChevronDown } from "react-icons/fa";
import Profile from "../Components/profile";
import '../Styles/navbar.css'
const Navbar = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isProfileOpened, setIsProfileOpened] = useState(false);
  const profileRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleSidebar = () => setIsSidebarOpened((prev) => !prev);
  const toggleProfile = () => setIsProfileOpened((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 // 👉 Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <>
      <nav className={`navbar ${showNavbar ? "visible" : "hidden"}`}>
        <div className="leftNav">
          <div className="iconContainer">
            <img
              src="/Consulto_Logo.png"
              className="navLogo"
              alt="Consulto Logo"
              onClick={() => window.location.reload()}
            />
          </div>
          <span className="hamIcon" onClick={toggleSidebar}>
            <FaBars />
          </span>
        </div>

        <div className="navLinks">
          <span className="navItems"><Link className="Link" to="/">HOME</Link></span>
          <span className="navItems"><Link className="Link" to="/aboutus">ABOUT US</Link></span>
          <span className="navItems"><Link className="Link" to="/alldoctors">ALL DOCTORS</Link></span>
          <span className="navItems"><Link className="Link" to="/contactus">CONTACT US</Link></span>
          <span className="navItems"><Link className="Link" to="/adminlogin">ADMIN</Link></span>
        </div>

        {/* Profile with dropdown */}
        <div className="profileWrapper" ref={profileRef}>
          <div className="profileIcon" onClick={toggleProfile}>
            <img src="/profile.png" alt="Profile" />
            <FaChevronDown />
          </div>
          {isProfileOpened && <Profile />}
        </div>
      </nav>

      {isSidebarOpened && (
        <>
          <div className="sidebar open">
            <div className="mobileNavLinks">
              <span className="mobileNavItems"><Link className="Link" to="/">HOME</Link></span>
              <span className="mobileNavItems"><Link className="Link" to="/aboutus">ABOUT US</Link></span>
              <span className="mobileNavItems"><Link className="Link" to="/alldoctors">ALL DOCTORS</Link></span>
              <span className="mobileNavItems"><Link className="Link" to="/contactus">CONTACT US</Link></span>
            </div>
          </div>
          <div className="backdrop" onClick={toggleSidebar}></div>
        </>
      )}
    </>
  );
};

export default Navbar;
