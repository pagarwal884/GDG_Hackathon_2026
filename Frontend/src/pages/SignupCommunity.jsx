import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"
import toast from "react-hot-toast"

const SignupCommunity = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    communityName: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    category: "",
    logo: null,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({ ...formData, [name]: files ? files[0] : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      let logoUrl = ""

      // Upload logo if provided
      if (formData.logo) {
        const logoRef = ref(storage, `community-logos/${Date.now()}_${formData.logo.name}`)
        await uploadBytes(logoRef, formData.logo)
        logoUrl = await getDownloadURL(logoRef)
      }

      // Create community account
      await signup(
        formData.email,
        formData.password,
        {
          name: formData.communityName,
          description: formData.description,
          category: formData.category,
          logo: logoUrl,
          type: "community",
          membersCount: 0,
          isFollowing: false
        },
        "community"
      )

      toast.success("Community created successfully!")
      navigate("/communities", { replace: true })
    } catch (error) {
      console.error("Signup error:", error)

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address")
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak")
      } else {
        toast.error("Community creation failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-8">
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-black">
              Community Name
            </label>
            <input
              name="communityName"
              value={formData.communityName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
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
              value={formData.confirmPassword}
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
              value={formData.description}
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
              value={formData.category}
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
            disabled={loading}
            className="w-full mt-2 px-4 py-2.5 rounded-md
            bg-orange-500 text-white font-medium
            hover:bg-orange-600 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Community..." : "Create Community"}
          </button>
        </form>

         {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-black/70">
          Already have an account?{" "}
          <span 
            className="text-orange-500 font-medium cursor-pointer hover:underline" 
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </section>
  )
}

export default SignupCommunity
