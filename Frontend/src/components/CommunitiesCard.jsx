import React, { useState } from "react"

const CommunitiesCard = ({ community }) => {
  const [isFollowing, setIsFollowing] = useState(
    community.isFollowing ?? false
  )

  return (
    <div className="relative group">
      {/* CARD WITH IMPROVED DESIGN */}
      <div
        className="w-full max-w-50 mx-auto
                   rounded-2xl p-5 flex flex-col items-center text-center
                   bg-white border border-gray-100
                   shadow-sm hover:shadow-xl 
                   transition-all duration-300
                   hover:border-orange-100
                   group-hover:scale-[1.02]"
      >
        {/* PROFILE IMAGE WITH ENHANCED STYLING */}
        <div className="relative mb-4">
          <div className="absolute -inset-2 bg-linear-to-r from-orange-100 to-amber-100 rounded-full opacity-0 
                        group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
          <img
            src={community.logo}
            alt={community.name}
            className="relative w-16 h-16 rounded-full object-cover 
                     border-2 border-white shadow-md
                     group-hover:border-orange-100 transition-colors duration-300"
          />
          {/* ONLINE INDICATOR */}
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>

        {/* COMMUNITY INFO */}
        <div className="w-full space-y-1.5 mb-4">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-800 transition-colors">
            {community.name}
          </p>
          <p className="text-xs text-gray-500 truncate px-1">
            {community.category}
          </p>
          
          {/* MEMBER COUNT (if available) */}
          {community.members && (
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>{community.members.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* FOLLOW BUTTON WITH IMPROVED STYLING */}
        <button
          onClick={() => setIsFollowing(prev => !prev)}
          className={`w-full text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300
            ${isFollowing
              ? "bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border border-gray-200"
              : "bg-linear-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg"
            }`}
        >
          {isFollowing ? (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Following
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Follow
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default CommunitiesCard