import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";

const navLinkClass = `
  relative
  text-black md:text-black
  hover:text-orange-500
  transition
  after:absolute after:left-0 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-orange-500
  after:transition-all after:duration-300
  hover:after:w-full
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // ← logged-in user state
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ Check localStorage for login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loginType = localStorage.getItem("loginType");
    if (isLoggedIn === "true" && loginType === "user") {
      // Example user object, replace with real data if available
      setUser({
        name: "John Doe",
        avatar: "/default-avatar.png"
      });
    }
  }, []);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">

      {/* LOGO */}
      <Link to="/" onClick={handleNavClick} className="max-md:flex-1">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold tracking-tight text-black">
            Local
          </span>
          <span className="text-4xl font-bold text-orange-600 tracking-tight">
            बैठक
          </span>
        </div>
      </Link>

      {/* NAVIGATION */}
      <div
        className={`
          fixed md:static inset-0 z-50
          flex flex-col md:flex-row
          items-center justify-center md:justify-between
          gap-8
          px-6 md:px-10 lg:px-14
          py-4 md:py-0 lg:py-4
          font-medium
          text-white md:text-black
          bg-black/30 backdrop-blur-xl
          md:bg-orange-400/50 md:backdrop-blur-md
          md:border md:border-white/20 md:rounded-full
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        {/* CLOSE ICON (Mobile) */}
        <X
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-black"
          onClick={() => setIsOpen(false)}
        />

        <Link to="/" onClick={handleNavClick} className={navLinkClass}>
          Home
        </Link>

        <Link to="/events" onClick={handleNavClick} className={navLinkClass}>
          Events
        </Link>

        <Link to="/communities" onClick={handleNavClick} className={navLinkClass}>
          Communities
        </Link>

        <Link to="/booking" onClick={handleNavClick} className={navLinkClass}>
          Booking
        </Link>

        <Link to="/About-Us" onClick={handleNavClick} className={navLinkClass}>
          AboutUs
        </Link>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-8">
        <Search className="max-md:hidden w-6 h-6 cursor-pointer text-black hover:text-orange-500 transition" />

        {/* LOGIN BUTTON OR USER AVATAR */}
        {user ? (
          <div
            className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center bg-orange-600 text-white font-medium border-2 border-orange-600"
            onClick={() => navigate("/profile")}
          >
            {user.name
              ? user.name
                .split(" ")
                .map(n => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
              : "US"}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-orange-600 hover:bg-orange-700 transition rounded-full font-medium text-white"
          >
            Login
          </button>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <Menu
        className="md:hidden ml-4 w-8 h-8 cursor-pointer text-black"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Navbar;
