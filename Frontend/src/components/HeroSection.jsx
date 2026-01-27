import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const handleProtectedNavigation = (path) => {
    if (!user) {
      openSignIn({
        redirectUrl: path, // after login, go here
      });
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url(public/background.png)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-16 lg:px-36">
        <div className="mt-auto pb-16 md:pb-24">
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight">
            Find Local Meetups{" "}
            <span className="text-orange-500">Near You</span>
          </h1>

          <p className="text-white/80 mt-4 text-lg md:text-xl max-w-xl">
            Explore events, communities and bookings with a modern local platform.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => handleProtectedNavigation("/events")}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold transition cursor-pointer"
            >
              Explore Events
            </button>

            <button
              onClick={() => handleProtectedNavigation("/About-Us")}
              className="px-6 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
