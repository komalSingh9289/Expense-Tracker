import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({
      ...userdata,
      [name]: value,
    });
  };

  const handleError = (err) => {
    toast.error(err, {
      position: "top-right",
    });
  };

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "top-right",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/signup", userdata);

      const { success, message } = res.data;

      if (success) {
        setUserdata({
          name: "",
          email: "",
          password: "",
        });
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log("server side error", error);
      handleError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-10 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Join ExpenseMate</h1>
            <p className="text-slate-400 font-medium tracking-tight">Start your journey to financial freedom</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={userdata.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={userdata.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={userdata.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-200 mt-4 tracking-tight"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 font-medium tracking-tight">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '1rem' }}
      />
    </div>
  );
};

export default Signup;
