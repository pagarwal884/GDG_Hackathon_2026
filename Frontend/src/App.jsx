import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./AuthContext"

import Home from "./pages/Home"
import Event from "./pages/Event"
import EventDetails from "./pages/EventDetails"
import Booking from "./pages/Booking"
import Favourite from "./pages/Favourite"
import Community from "./pages/Community"
import ProfilePage from "./pages/ProfilePage"
import AboutUs from "./pages/AboutUs"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SignupCommunity from "./pages/SignupCommunity"
import RegistrationForm from "./components/RegistrationForm"
import Admin from "./components/Admin"

const App = () => {
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith("/admin")
  const isAuthPage =
    location.pathname === "/login" || 
    location.pathname === "/signin" || 
    location.pathname === "/signincommunity"
  const isRegiForm = location.pathname.startsWith("/register")

  return (
    <AuthProvider>
      <Toaster position="top-center" />

      {/* NAVBAR */}
      {!isAdminRoute && !isAuthPage && !isRegiForm && <Navbar />}

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="/signincommunity" element={<SignupCommunity />} />
        <Route path="/register/:id" element={<RegistrationForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Event />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/communities" element={<Community />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route
          path="*"
          element={
            <div className="text-center mt-24 text-xl">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>

      {/* FOOTER */}
      {!isAdminRoute && !isAuthPage && !isRegiForm && <Footer />}
    </AuthProvider>
  )
}

export default App