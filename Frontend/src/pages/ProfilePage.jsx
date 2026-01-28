import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../AuthContext"
import { LogOut, User, Mail } from "lucide-react"
import toast from "react-hot-toast"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, userType, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login", { replace: true })
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <section className="bg-orange-50 min-h-screen border-t border-black/10">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-24 pb-20">
        
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <p className="text-black font-semibold text-lg">Profile</p>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your account information
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="max-w-2xl bg-white border border-black/10 rounded-xl p-6 shadow-sm">
          
          {/* AVATAR */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-black/10">
            <div className="w-20 h-20 rounded-full bg-orange-600 text-white font-bold text-2xl flex items-center justify-center">
              {user.name
                ? user.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "US"}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-black mb-1">
                {user.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {userType} Account
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <User className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{user.name || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
            bg-red-50 text-red-600 rounded-lg font-medium
            hover:bg-red-100 transition border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
