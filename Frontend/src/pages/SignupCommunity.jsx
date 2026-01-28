import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignupCommunity = () => {
  const [formData, setFormData] = useState({
    communityName: "",
    description: "",
    category: "",
    logo: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({ ...formData, [name]: files ? files[0] : value })
  }

  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-lg bg-white border border-black/10 rounded-xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-black">
            Create a Community
          </h1>
          <p className="text-sm text-black/60 mt-1">
            Register and manage your community
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-black">
              Community Name
            </label>
            <input
              name="communityName"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10 resize-none
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Category
            </label>
            <select
              name="category"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select category</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
              <option value="startup">Startup</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Community Logo
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2.5 rounded-md
            bg-orange-500 text-white font-medium
            hover:bg-orange-600 transition"
          >
            Create Community
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

export default SignupCommunity
