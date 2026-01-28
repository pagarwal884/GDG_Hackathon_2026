import React from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import {
  dummyBookings,
  dummySessions,
  dummyCommunities,
} from "../assets/assets"

const Booking = () => {
  // Merge booking + session + community
  const bookingsWithDetails = dummyBookings.map((booking) => {
    const session = dummySessions.find(
      (s) => s._id === booking.sessionId
    )
    const community = dummyCommunities.find(
      (c) => c._id === booking.communityId
    )

    return {
      ...booking,
      session,
      community,
    }
  })

  return (
    <section className="bg-orange-50 min-h-screen border-t border-black/10">

      {/* HEADER */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <p className="text-black font-semibold text-lg">
            My Bookings
          </p>
        </div>

        <p className="text-gray-600 text-sm md:text-base max-w-xl">
          All your upcoming event bookings in one place.
        </p>
      </div>

      {/* BOOKINGS LIST */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pb-20">

        {bookingsWithDetails.length > 0 ? (
          <div className="space-y-4">
            {bookingsWithDetails.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-black/10 rounded-lg p-5
                           flex flex-col md:flex-row md:items-center
                           justify-between gap-4 hover:shadow-sm transition"
              >
                {/* LEFT */}
                <div>
                  <h3 className="font-semibold text-black text-base">
                    {booking.session?.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {booking.community?.name}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {booking.session?.date}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {booking.session?.time}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {booking.session?.venue}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium
                             bg-green-100 text-green-700 w-fit"
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-20">
            You have no bookings yet.
          </p>
        )}

      </div>
    </section>
  )
}

export default Booking
