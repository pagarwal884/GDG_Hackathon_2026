import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../AuthContext"
import toast from "react-hot-toast"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState("user") // "user" | "community"
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password, loginType)
      
      toast.success("Login successful!")
      
      // Redirect based on type
      if (loginType === "user") {
        navigate("/", { replace: true })
      } else {
        navigate("/communities", { replace: true })
      }
    } catch (error) {
      console.error("Login error:", error)
      
      if (error.message.includes("No")) {
        toast.error(error.message)
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password")
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email")
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password")
      } else {
        toast.error("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-md bg-white border border-black/10 rounded-xl p-6 shadow-sm">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-black">
            {loginType === "user" ? "Welcome back" : "Community Access"}
          </h1>
          <p className="text-sm text-black/60 mt-1">
            {loginType === "user"
              ? "Login to continue"
              : "Register or manage your community"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex mb-6 rounded-lg border border-black/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`w-1/2 py-2 text-sm font-medium transition
              ${loginType === "user"
                ? "bg-orange-500 text-white"
                : "bg-white text-black hover:bg-black/5"}`}
          >
            User Login
          </button>

          <button
            type="button"
            onClick={() => setLoginType("community")}
            className={`w-1/2 py-2 text-sm font-medium transition
              ${loginType === "community"
                ? "bg-orange-500 text-white"
                : "bg-white text-black hover:bg-black/5"}`}
          >
            Community Login
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-black">
              {loginType === "user" ? "Email" : "Community Email"}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2.5 rounded-md border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-md border border-black/10
                focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2.5 rounded-md
            bg-orange-500 text-white font-medium hover:bg-orange-600 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : loginType === "user" ? "Login" : "Continue as Community"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-black/70">
          {loginType === "user" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-orange-500 hover:underline font-medium"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Haven't registered your community?{" "}
              <button
                onClick={() => navigate("/signincommunity")}
                className="text-orange-500 hover:underline font-medium"
              >
                Register now
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Login
