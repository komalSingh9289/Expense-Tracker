import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../Context/auth";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { verifyUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleError = (err) => {
    toast.error(err, {
      position: "top-left",
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
      const res = await axios.post("http://localhost:5001/login", user, {
        withCredentials: true,
      });

      // Access the response data
      const { success, message } = res.data;

      if (success) {
        setUser({
          email: "",
          password: "",
        });
        verifyUser();
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log("server side error", error);
      handleError(message);
    }
  };

  return (
    <section className="bg-gray-900 py-16 min-h-screen">
      <ToastContainer />
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-gray-50 mb-6">
          Login to ExpenseMate
        </h2>
        <p className="text-gray-400 mb-8">Welcome back!</p>

        {/* Login Form Section */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Your Password"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300"
              >
                Login
              </button>
            </div>
          </form>

          {/* Google Login Option */}
          <div className="my-4">
            <p className="text-gray-400">or</p>
            <button className="flex mt-3 items-center justify-center w-full px-6 py-2 border border-gray-600 rounded-lg transition duration-300 hover:bg-gray-700">
              <FaGoogle className="mr-2 text-red-600" />
              <span className="text-gray-200">Login with Google</span>
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-4">
            <p className="text-gray-400">
              Don't have an account ?
              <NavLink
                to="/login"
                className="text-blue-500 ml-1 hover:underline"
              >
                Signup here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
