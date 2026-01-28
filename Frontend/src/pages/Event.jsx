import React from "react"
import EventCard from "../components/EventCard"
import { dummySessions, dummyCommunities } from "../assets/assets"

const Event = () => {
  // Filter sessions where the community is being followed
  const followingSessions = dummySessions.filter((session) => {
    const community = dummyCommunities.find(c => c._id === session.communityId)
    return community?.isFollowing
  })

  // All sessions (public)
  const upcomingSessions = dummySessions

  return (
    <div className="pt-[88px] px-4 md:px-16 lg:px-36 pb-16 bg-gray-50 min-h-screen">

      {/* FOLLOWING EVENTS */}
      <section className="mb-20">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-black font-semibold text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              From your Following List
            </p>
            <p className="text-sm text-black/60 mt-1">
              Discover events hosted by communities you follow
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {followingSessions.length > 0 ? (
            followingSessions.map((session) => {
              const community = dummyCommunities.find(c => c._id === session.communityId)
              return (
                <EventCard
                  key={session._id}
                  session={session}
                  community={community}
                />
              )
            })
          ) : (
            <p className="text-black/60 col-span-full text-center">
              You are not following any communities yet.
            </p>
          )}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-black font-semibold text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Upcoming Events
            </p>
            <p className="text-sm text-black/60 mt-1">
              Discover events hosted by all communities
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {upcomingSessions.map((session) => {
            const community = dummyCommunities.find(c => c._id === session.communityId)
            return (
              <EventCard
                key={session._id}
                session={session}
                community={community}
              />
            )
          })}
        </div>
      </section>

    </div>
  )
}

export default Event
