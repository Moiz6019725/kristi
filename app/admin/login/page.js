"use client";
import React, { useState } from "react";
import { Eye, EyeOff} from "lucide-react"
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert("You must agree to terms and conditions");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const response = await res.json();

      if (response.status === 200) router.push("/admin/dashboard");
      else alert(response.message);
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800">
      {/* Glass Card */}
      <div
        className="relative w-full max-w-md p-8 rounded-2xl 
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-gray-200 text-center mb-2">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Secure access for administrators
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 shadow-sm placeholder-gray-400"
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 shadow-sm placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-2.5 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18}/>
                ) : (
                  <Eye size={18}/>
                )}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-indigo-200"
              />
              <span className="text-sm text-gray-200 select-none">
                I agree with the{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  terms and conditions
                </a>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white bg-gray-900 hover:bg-gray-800 cursor-pointer focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 shadow-sm focus:outline-none transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Authorized access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
