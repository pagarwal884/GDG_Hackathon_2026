import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, TicketPlus, X } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {/* LOGO */}
      <Link to="/" className="max-md:flex-1">
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
    text-white font-medium
    bg-black/90 backdrop-blur-xl
    md:bg-white/10 md:backdrop-blur-md
    md:border md:border-white/20 md:rounded-full
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
  `}
>
  <X
    className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white"
    onClick={() => setIsOpen(false)}
  />

  <Link
    to="/"
    onClick={handleNavClick}
    className="hover:text-orange-500 transition"
  >
    Home
  </Link>

  <Link
    to="/events"
    onClick={handleNavClick}
    className="hover:text-orange-500 transition"
  >
    Events
  </Link>

  <Link
    to="/communities"
    onClick={handleNavClick}
    className="hover:text-orange-500 transition"
  >
    Communities
  </Link>

  <Link
    to="/booking"
    onClick={handleNavClick}
    className="hover:text-orange-500 transition"
  >
    Booking
  </Link>
</div>


      {/* RIGHT SECTION */}
      <div className="flex items-center gap-8">
        <Search className="max-md:hidden w-6 h-6 cursor-pointer text-black" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-orange-600 hover:bg-orange-700 transition rounded-full font-medium text-white"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/mybookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <Menu
        className="md:hidden ml-4 w-8 h-8 cursor-pointer text-white"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Navbar;
