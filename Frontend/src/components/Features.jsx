import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { dummySessions, dummyCommunities } from "../assets/assets";

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-orange-50 border-t border-black/10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 md:gap-0 px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <p className="text-black font-semibold text-lg">Upcoming Events</p>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Discover events hosted by communities that match your interests
          </p>
        </div>

        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-1 text-sm font-semibold text-orange-600
                     hover:text-orange-700 transition cursor-pointer"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* GRID */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {dummySessions.map((session) => {
            const community = dummyCommunities.find(
              (c) => c._id === session.communityId
            );

            return (
              <EventCard
                key={session._id}
                session={session}
                community={community}
              />
            );
          })}
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="flex justify-center pb-20">
        <button
          onClick={() => {
            navigate("/events");
            scrollTo(0, 0);
          }}
          className="px-8 py-2.5 text-sm font-medium rounded-md
                     border border-orange-500 text-orange-600
                     hover:bg-orange-500 hover:text-white transition"
        >
          Show more
        </button>
      </div>
    </section>
  );
};

export default Features;
