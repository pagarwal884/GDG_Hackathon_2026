import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const navigate = useNavigate()

  return (

    <section className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md bg-white border border-black/10 rounded-xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-black">
            Create Account
          </h1>
          <p className="text-sm text-black/60 mt-1">
            Join and start exploring
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2.5 rounded-md
            bg-orange-500 text-white font-medium
            hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-black/70">
          Already have an account?{" "}
          <span className="text-orange-500 font-medium cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </section>
  )
}

export default Signup
