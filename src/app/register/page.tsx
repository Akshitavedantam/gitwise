"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff, User, Lock, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Logic for creating a new user in your database
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (res.ok) {
        // After successful registration, log them in
        await signIn("credentials", { email, password, callbackUrl: "/post-login" });
      }
    } else {
      // Logic for signing in existing users
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/post-login");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-auto px-4 py-8 text-white">
      {/* 🔸 Main Content */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center">
        {/* 🖼️ Illustration */}
        <div className="hidden md:flex w-1/2 justify-center">
          <img src="/Untitled 2.svg" alt="Illustration" className="w-[460px]" />
        </div>

        {/* 📄 Form Container */}
        <div className="w-full md:w-[48%] flex justify-start md:pl-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl px-7 py-6 w-full max-w-[400px] h-fit border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-2">
              {isSignUp ? "Register!" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-300 text-center mb-5">
              {isSignUp
                ? "Enter your details and get started with GitWise!"
                : "Login to continue exploring GitWise."}
            </p>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                  <User className="absolute left-3 top-2.5 text-purple-400" size={18} />
                </div>
              )}

              <div className="relative">
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                <AtSign className="absolute left-3 top-2.5 text-purple-400" size={18} />
              </div>

              <div className="relative">
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                <Lock className="absolute left-3 top-2.5 text-purple-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-purple-400"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {isSignUp && (
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    type="password"
                    placeholder="confirm password"
                    required
                    className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-sm hover:opacity-90 transition duration-300"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>

              {/* 🔗 Social Auth */}
              <div className="flex items-center justify-center gap-3 my-5 text-gray-500 text-xs">
                <span className="w-1/4 h-px bg-gray-600" />
                <span>or sign in with</span>
                <span className="w-1/4 h-px bg-gray-600" />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/post-login" })}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/google.svg" alt="Google" className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/apple.svg" alt="Apple" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/post-login" })}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* 🔁 Toggle Auth Mode */}
            <div className="text-sm text-center text-gray-400 mt-5">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}