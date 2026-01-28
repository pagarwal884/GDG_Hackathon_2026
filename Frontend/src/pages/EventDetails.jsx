import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"
import { dummySessions, dummyCommunities } from "../assets/assets"

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const session = dummySessions.find(s => s._id === id)
  const community = dummyCommunities.find(c => c._id === session?.communityId)

  if (!session || !community) return null

  const spotsLeft = session.capacity - session.registeredCount

  return (
    <section className="min-h-screen bg-white border-t border-black/10">
      <div className="pt-28 px-6 md:px-16 lg:px-24 xl:px-32 pb-20 max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Events
        </button>

        {/* HEADER */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="font-semibold text-black">Event Details</p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {session.title}
          </h1>

          <p className="text-gray-600">
            Hosted by <span className="text-black font-medium">{community.name}</span>
          </p>
        </header>

        {/* MAIN CARD */}
        <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">

          {/* COVER */}
          <img
            src={community.coverImage}
            alt={session.title}
            className="w-full h-64 md:h-80 object-cover"
          />

          <div className="p-6 md:p-10">

            {/* META */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700 mb-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {session.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {session.time}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {session.venue}
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {spotsLeft} spots left
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/booking")}
              className="
                w-full sm:w-auto
                px-10 py-4
                rounded-full
                bg-orange-600 hover:bg-orange-700
                text-white font-semibold
                transition
                mb-12
              "
            >
              {session.price === 0
                ? "Register for Free"
                : `Register for ₹${session.price}`}
            </button>

            {/* DESCRIPTION */}
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-black mb-3">
                About this event
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {session.description}
              </p>
            </section>

            {/* HOST */}
            <section className="flex items-center gap-4 p-5 rounded-2xl border border-black/10 bg-gray-50">
              <img
                src={community.logo}
                alt={community.name}
                className="w-12 h-12 rounded-xl object-cover"
              />

              <div>
                <p className="font-semibold text-black">{community.name}</p>
                <p className="text-sm text-gray-600">
                  {community.membersCount} members
                </p>
              </div>
            </section>

          </div>
        </div>

      </div>
    </section>
  )
}

export default EventDetails
