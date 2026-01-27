import React from "react"
import CommunitiesCard from "./CommunitiesCard"
import { dummyCommunities } from "../assets/assets"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CommunitySection = () => {
    const navigate = useNavigate()
  return (
    <section className="px-6 md:px-16 lg:px-24 py-12">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Popular Communities
        </h2>

        <button
        onClick={() => navigate('/communities')}
          className="flex items-center gap-1 text-sm font-medium
                     text-orange-600 hover:text-orange-700 transition cursor-pointer"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* COMMUNITY LIST */}
      <div className="space-y-4">
        {dummyCommunities.map((community) => (
          <CommunitiesCard
            key={community._id}
            community={community}
          />
        ))}
      </div>
    </section>
  )
}

export default CommunitySection
