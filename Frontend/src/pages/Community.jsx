import React, { useState } from "react"
import { Search } from "lucide-react"
import { dummyCommunities, categories } from "../assets/assets"
import CommunitiesCard from "../components/CommunitiesCard"

const Community = () => {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredCommunities = dummyCommunities.filter((community) => {
    const matchesSearch = community.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "following"
        ? community.isFollowing
        : community.category ===
          categories.find(c => c.id === activeCategory)?.name

    return matchesSearch && matchesCategory
  })

  return (
    <section className="bg-orange-50 min-h-screen border-t border-black/10">

      {/* HEADER */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <p className="text-black font-semibold text-lg">Communities</p>
        </div>

        <p className="text-gray-600 text-sm md:text-base max-w-xl">
          Follow communities to get personalized events and updates.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mb-10 space-y-6">

        {/* SEARCH */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-black/10
                       focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${
                activeCategory === "all"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-black/10 hover:border-orange-500"
              }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm border transition
                ${
                  activeCategory === cat.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-black/10 hover:border-orange-500"
                }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCommunities.map((community) => (
            <CommunitiesCard
              key={community._id}
              community={community}
            />
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No communities found.
          </p>
        )}
      </div>
    </section>
  )
}

export default Community
