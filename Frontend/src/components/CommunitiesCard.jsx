import React, { useState } from "react"

const CommunitiesCard = ({ community }) => {
  const [isFollowing, setIsFollowing] = useState(
    community.isFollowing ?? false
  )

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl
      bg-white border border-black/10
      hover:shadow-sm transition"
    >
      {/* IMAGE */}
      <img
        src={community.logo}
        alt={community.name}
        className="w-14 h-14 rounded-full object-cover border"
      />

      {/* TEXT */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-black">
          {community.name}
        </p>
        <p className="text-xs text-black/60">
          {community.category}
        </p>
      </div>

      {/* FOLLOW BUTTON */}
      <button
        onClick={() => setIsFollowing(prev => !prev)}
        className={`px-4 py-1.5 text-sm rounded-full font-medium transition
          ${
            isFollowing
              ? "bg-gray-100 text-black/70 hover:bg-gray-200"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } cursor-pointer`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  )
}

export default CommunitiesCard
