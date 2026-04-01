import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { signup, login } from "../lib/api";
import { useNavigate } from "react-router-dom";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));

      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await login({
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        setIsLoggedIn(true);
        setUser(res.user);
        navigate("/");
      } else {
        await signup({
          username: form.username,
          email: form.email,
          password: form.password,
        });

        alert("Signup successful, please login");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white rounded-2xl shadow-lg flex w-full max-w-5xl overflow-hidden">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">
            {isLogin ? "Login" : "Sign up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 👇 SHOW ONLY IN SIGNUP */}
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Your Name"
                value={form.username}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none py-2"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:outline-none py-2"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:outline-none py-2"
              required
            />

            {/* 👇 ONLY IN SIGNUP */}
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none py-2"
                required
              />
            )}

            {!isLogin && (
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" required />
                <span>
                  I agree all statements in{" "}
                  <span className="underline cursor-pointer">
                    Terms of service
                  </span>
                </span>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* 🔁 TOGGLE LINK */}
          <p className="mt-6 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="underline cursor-pointer text-blue-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <img
            src="/img.webp"
            alt="auth"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
