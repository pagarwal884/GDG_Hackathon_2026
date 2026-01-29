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
    <section className="min-h-screen bg-linear-to-b from-orange-50 to-white border-t border-black/10 flex justify-center">
      <div className="w-full max-w-4xl px-6 md:px-16 pt-24 pb-20">
        
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="text-black font-semibold text-xl">Profile</p>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            Manage your personal account details
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="max-w-2xl mx-auto bg-white border border-black/10 rounded-2xl p-8 shadow-lg shadow-black/5">
          
          {/* AVATAR SECTION */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-black/10">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-500 to-orange-600 
              text-white font-bold text-2xl flex items-center justify-center shadow-md">
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
              <h2 className="text-2xl font-semibold text-black leading-tight">
                {user.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 capitalize mt-0.5">
                {userType} account
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-5 mb-8">
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/60 border border-orange-100">
              <User className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Name
                </p>
                <p className="font-medium text-gray-800">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/60 border border-orange-100">
              <Mail className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <p className="font-medium text-gray-800">
                  {user.email}
                </p>
              </div>
            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
              rounded-xl font-semibold
              bg-red-50 text-red-600 border border-red-200
              hover:bg-red-100 hover:border-red-300
              transition-all"
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
