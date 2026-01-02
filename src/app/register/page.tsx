"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { getSession } from 'next-auth/react';

import { Eye, EyeOff, User, AtSign } from "lucide-react";

export default function RegisterPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(currentForm => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match. Please try again.");
          return;
        }

        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || "An unknown error occurred.");
          } catch (parseError) {
            throw new Error(errorText || "Something went wrong during registration.");
          }
        }

        const signInResult = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        if (signInResult?.error) {
          setError("Account created, but auto-login failed. Please try signing in manually.");
        } else {
          const session = await getSession();
          if (session?.user?.isFirstLogin) {
            router.replace('/how-it-works');
          } else {
            router.replace('/input');
          }
        }

      } else {
        console.log("Attempting manual sign-in...");
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        console.log("Sign-in result:", signInResult);

        if (signInResult?.error) {
          console.error("Manual sign-in error:", signInResult.error);
          setError("Invalid email or password. Please try again.");
        } else {
          const session = await getSession();
          if (session?.user?.isFirstLogin) {
            router.replace('/how-it-works');
          } else {
            router.replace('/input');
          }
        }
      }
    } catch (err) {
      console.error("Caught an unexpected error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/post-login' });
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-auto px-4 py-8 text-white">
      
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center">
        
        <div className="hidden md:flex w-1/2 justify-center">
          <img src="/Untitled 2.svg" alt="Illustration" className="w-[460px]" />
        </div>

        
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
          
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-red-500 text-center font-semibold text-sm">{error}</p>
              )}

              {isSignUp && (
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    name="username"
                    type="text"
                    placeholder="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                  <User
                    className="absolute left-3 top-2.5 text-purple-400"
                    size={18}
                  />
                </div>
              )}

              <div className="relative">
                <input
                  suppressHydrationWarning
                  name="email"
                  type="email"
                  placeholder="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                <AtSign
                  className="absolute left-3 top-2.5 text-purple-400"
                  size={18}
                />
              </div>

              <div className="relative">
                <input
                  suppressHydrationWarning
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-purple-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {!isSignUp && (
                  <div className="text-sm text-right -mt-2">
                      <Link href="/forgot-password" className="font-medium text-purple-400 hover:underline">
                          Forgot your password?
                      </Link>
                  </div>
              )}

              {isSignUp && (
                <div className="relative">
                  <input
                    suppressHydrationWarning
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-10 py-2.5 rounded-full bg-gradient-to-r from-[#1b1b1f] to-[#2c2c35] text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold text-sm hover:opacity-90 transition duration-300 disabled:opacity-50"
              >
                {loading
                  ? isSignUp
                    ? "Registering..."
                    : "Signing in..."
                  : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
              </button>

              <div className="flex items-center justify-center gap-3 my-5 text-gray-500 text-xs">
                <span className="w-1/4 h-px bg-gray-600" />
                <span>or sign in with</span>
                <span className="w-1/4 h-px bg-gray-600" />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("google")}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/google.svg" alt="Google" className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => handleOAuthSignIn("linkedin")}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/linkedin.svg" alt="Linkedin" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn("github")}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200"
                >
                  <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            <div className="text-sm text-center text-gray-400 mt-5">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:underline"
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
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
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
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
