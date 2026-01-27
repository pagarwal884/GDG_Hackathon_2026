import { ArrowRight, Users } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

const EventCard = ({ session, community }) => {
  const navigate = useNavigate()

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden 
      bg-white border border-black/10
      hover:shadow-md transition"
    >
      {/* IMAGE */}
      <div
        className="h-40 cursor-pointer"
        onClick={() => {
          navigate(`/events/${session._id}`)
          scrollTo(0, 0)
        }}
      >
        <img
          src={community.coverImage}
          alt={session.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="text-base font-semibold text-black line-clamp-1">
          {session.title}
        </p>

        <p className="text-sm text-black/60">
          {community.name}
        </p>

        <p className="text-sm text-black/50">
          {new Date(session.date).toDateString()}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="flex items-center gap-1 text-sm text-black/60">
            <Users className="w-4 h-4" />
            {session.registeredCount}/{session.capacity}
          </p>

          <p className="text-sm font-semibold text-orange-600">
            {session.price === 0 ? "Free" : `₹${session.price}`}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          navigate(`/events/${session._id}`)
          scrollTo(0, 0)
        }}
        className="flex items-center justify-center gap-2 
        py-2 text-sm font-medium text-orange-600
        border-t hover:bg-orange-50 transition cursor-pointer"
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default EventCard
