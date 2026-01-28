import React, { useState, useEffect } from "react"

const CommunitiesCard = ({ community }) => {
  const [isFollowing, setIsFollowing] = useState(community.isFollowing)

  useEffect(() => {
    setIsFollowing(community.isFollowing)
  }, [community.isFollowing])

  return (
    <div className="relative group">
      <div
        className="w-full rounded-2xl p-5 flex flex-col items-center text-center
                   bg-white border border-black/10
                   shadow-sm hover:shadow-xl
                   transition-all duration-300
                   hover:border-orange-200
                   group-hover:scale-[1.02]"
      >
        {/* LOGO */}
        <div className="relative mb-4">
          <div
            className="absolute -inset-2 rounded-full bg-orange-100
                       opacity-0 group-hover:opacity-100 blur-md transition"
          />
          <img
            src={community.logo}
            alt={community.name}
            className="relative w-16 h-16 rounded-full object-cover
                       border-2 border-white shadow-md"
          />
        </div>

        {/* INFO */}
        <div className="w-full space-y-1 mb-4">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {community.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {community.category}
          </p>

          <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <span>{community.membersCount.toLocaleString()} members</span>
          </div>
        </div>

        {/* FOLLOW BUTTON */}
        <button
          onClick={() => setIsFollowing(prev => !prev)}
          className={`w-full text-xs font-semibold px-4 py-2 rounded-lg transition
            ${
              isFollowing
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  )
}

export default CommunitiesCard
