import React from "react";
import Navbar from "../components/Navbar";

const Main = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('public/background.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col h-screen px-6 md:px-16 lg:px-36">
        
        {/* Bottom Hero Content */}
        <div className="mt-auto pb-16 md:pb-24">
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight">
            Find Local Meetups{" "}
            <span className="text-orange-500">Near You</span>
          </h1>

          <p className="text-white/80 mt-4 text-lg md:text-xl max-w-xl">
            Explore events, communities and bookings with a modern local platform.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold">
              Explore Events
            </button>

            <button className="px-6 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Main;
