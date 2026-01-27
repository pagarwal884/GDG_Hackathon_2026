import { ArrowRight } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import EventCard from "./EventCard"
import { dummySessions, dummyCommunities } from "../assets/assets"

const Features = () => {
  const navigate = useNavigate()

  return (
    <section className="relative bg-orange-50 border-t border-black/10">
      
      {/* HEADER */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-6 flex items-center justify-between">
        <p className="text-black font-semibold text-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Upcoming Events
        </p>

        <button
          onClick={() => navigate("/events")}
          className="group flex items-center gap-2 text-sm text-black/70 hover:text-orange-500 transition cursor-pointer"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="px-4 md:px-16 lg:px-24 xl:px-44 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {dummySessions.map((session) => {
            const community = dummyCommunities.find(
              (c) => c._id === session.communityId
            )

            return (
              <EventCard
                key={session._id}
                session={session}
                community={community}
              />
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-20">
        <button
          onClick={() => {
            navigate("/events")
            scrollTo(0, 0)
          }}
          className="px-8 py-2.5 text-sm font-medium rounded-md
          border border-orange-500 text-orange-600
          hover:bg-orange-500 hover:text-white transition cursor-pointer"
        >
          Show more
        </button>
      </div>
    </section>
  )
}

export default Features
