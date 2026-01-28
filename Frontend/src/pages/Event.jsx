import React from "react"
import EventCard from "../components/EventCard"
import { dummySessions, dummyCommunities } from "../assets/assets"

const Event = () => {
  // Sessions from followed communities
  const followingSessions = dummySessions.filter((session) => {
    const community = dummyCommunities.find(
      (c) => c._id === session.communityId
    )
    return community?.isFollowing
  })

  // All public sessions
  const upcomingSessions = dummySessions

  return (
    <section className="bg-orange-50 min-h-screen border-t border-black/10">

      {/* PAGE CONTAINER */}
      <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 pb-20">

        {/* FOLLOWING EVENTS */}
        <section className="mb-20">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <p className="text-black font-semibold text-lg">
                From your Following List
              </p>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Discover events hosted by communities you follow
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {followingSessions.length > 0 ? (
              followingSessions.map((session) => {
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
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 mt-20">
                You are not following any communities yet.
              </p>
            )}
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section>
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <p className="text-black font-semibold text-lg">
                Upcoming Events
              </p>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Discover events hosted by all communities
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {upcomingSessions.map((session) => {
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
        </section>

      </div>
    </section>
  )
}

export default Event
