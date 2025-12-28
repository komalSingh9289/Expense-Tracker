import React, { useEffect } from "react";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/auth";
import Loading from "../Loading";
import { UserProvider } from "../../Context/UserContext"; // Adjust the path as necessary


const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <SideBar />
        <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">

          <Outlet />

        </main>
      
      </div>
    </UserProvider>
  );
};

export default Dashboard;
