import React from "react";
import expenseMate from "../assets/finance.svg";
import Features from "../Components/Features";
import Working from "../Components/Working";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 md:px-8 h-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-10 md:mb-0 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Track Your Expenses <br /> Manage Your Finances
            </h1>
            <p className="text-gray-400 mt-4 md:text-lg">
              Simplify your financial life with ExpenseMate, the smart way to
              track, manage, and optimize your spending.
            </p>
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-300">
              <NavLink to="/login">Get Started</NavLink>
            </button>
          </div>

          <div className="md:w-1/2">
            <img
              src={expenseMate} // Replace with your own image or illustration
              alt="Expense Tracker"
              className="w-full h-4/5 object-cover"
            />
          </div>
        </div>
      </section>

      <Features />
      <Working />
    </>
  );
};

export default Home;
