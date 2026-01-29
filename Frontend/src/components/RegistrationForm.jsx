import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { User, Mail, Phone, MapPin, ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"
import { dummySessions, dummyCommunities } from "../assets/assets"

const RegistrationForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const session = dummySessions.find((s) => s._id === id)
  const community = dummyCommunities.find((c) => c._id === session?.communityId)

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    address: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session || !community) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-600">Event not found</p>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000))

    toast.success("Registration Successful! Redirecting...")

    setTimeout(() => {
      navigate("/booking")
    }, 1500)

    setIsSubmitting(false)
  }

  return (
    <section className="min-h-screen bg-orange-50 border-t border-black/10">
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event
        </button>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="font-semibold text-black">Event Registration</p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Complete Your Registration
          </h1>

          <p className="text-gray-600">
            Registering for{" "}
            <span className="text-black font-medium">{session.title}</span>
          </p>
        </header>

        {/* Event Summary */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-black/10 bg-orange-50 mb-8">
          <img
            src={community.logo}
            alt={community.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-semibold text-black">{session.title}</p>
            <p className="text-sm text-gray-600">
              {session.date} • {session.time}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 rounded-3xl p-8 md:p-10 shadow-sm space-y-6"
        >
          {/* Name (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" /> Phone Number{" "}
              <span className="text-orange-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" /> Address{" "}
              <span className="text-orange-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              required
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? "Processing..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </section>
  )
}

export default RegistrationForm