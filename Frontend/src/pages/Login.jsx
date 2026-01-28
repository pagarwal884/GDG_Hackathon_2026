import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loginType, setLoginType] = useState("user") // "user" | "community"

    return (
        <section className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
            <div className="w-full max-w-md bg-white border border-black/10 rounded-xl p-6 shadow-sm">

                {/* TOGGLE BUTTONS */}


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

                <div className="flex mb-6 rounded-lg border border-black/10 overflow-hidden">
                    <button
                        onClick={() => setLoginType("user")}
                        className={`w-1/2 py-2 text-sm font-medium transition
              ${loginType === "user"
                                ? "bg-orange-500 text-white"
                                : "bg-white text-black hover:bg-black/5"}`}
                    >
                        User Login
                    </button>

                    <button
                        onClick={() => setLoginType("community")}
                        className={`w-1/2 py-2 text-sm font-medium transition
              ${loginType === "community"
                                ? "bg-orange-500 text-white"
                                : "bg-white text-black hover:bg-black/5"}`}
                    >
                        Community Registry
                    </button>
                </div>

                {/* FORM */}
                <form className="space-y-4">

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm font-medium text-black">
                            {loginType === "user" ? "Email" : "Community Email"}
                        </label>
                        <input
                            type="email"
                            placeholder={
                                loginType === "user"
                                    ? "you@example.com"
                                    : "community@example.com"
                            }
                            className="mt-1 w-full px-4 py-2.5 rounded-md
              border border-black/10
              focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm font-medium text-black">
                            Password
                        </label>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-md
                border border-black/10
                focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2
                text-black/50 hover:text-black transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-full mt-2 px-4 py-2.5 rounded-md
            bg-orange-500 text-white font-medium
            hover:bg-orange-600 transition"
                    >
                        {loginType === "user" ? "Login" : "Continue as Community"}
                    </button>
                </form>

                {/* FOOTER */}
                <div className="mt-6 text-center text-sm text-black/70">
                    {loginType === "user" ? (
                        <>
                            Don’t have an account?{" "}
                            <button
                                onClick={() => navigate("/signin")}
                                className="text-orange-500 hover:underline font-medium"
                            >
                                Create one
                            </button>
                        </>
                    ) : (
                        <>
                            Haven’t registered your community?{" "}
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
