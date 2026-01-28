import React from "react";
import CommunitiesCard from "./CommunitiesCard";
import { dummyCommunities } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CommunitySection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 md:py-16">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Discover Communities
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Join communities that match your interests
            </p>
          </div>

          <button
            onClick={() => navigate("/communities")}
            className="flex items-center gap-1 text-sm font-semibold text-orange-600
                       hover:text-orange-700 transition cursor-pointer"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* STATIC GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {dummyCommunities.slice(0, 6).map((community) => (
            <div key={community._id} className="cursor-pointer">
              <CommunitiesCard community={community} />
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON (BOTTOM) */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/communities")}
            className="px-8 py-3 text-sm font-semibold rounded-md
                       border border-orange-500 text-orange-600
                       hover:bg-orange-500 hover:text-white
                       transition cursor-pointer"
          >
            Explore all communities
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
