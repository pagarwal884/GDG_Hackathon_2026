import React from "react";

const Footer = () => {
  return (
    <footer className="bg-orange-50 border-t border-black/10 text-black">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* BRAND (Same Logo as Navbar) */}
          <div>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold tracking-tight text-black">
                Local
              </span>
              <span className="text-4xl font-bold text-orange-600 tracking-tight">
                बैठक
              </span>
            </div>

            <p className="text-sm text-black/70 mt-2">
              Connecting you to the best communities in your city.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li>Home</li>
              <li>Communities</li>
              <li>Events</li>
              <li>About</li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-black/10 mt-10 pt-6 text-sm text-black/60 text-center">
          © {new Date().getFullYear()}{" "}
          <span className="text-black font-semibold">Local</span>
          <span className="text-orange-600 font-semibold"> बैठक</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
