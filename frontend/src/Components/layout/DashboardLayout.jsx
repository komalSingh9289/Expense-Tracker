import React, { useEffect } from "react";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/auth";
import Loading from "../Loading";
import { UserProvider } from "../../Context/UserContext"; // Adjust the path as necessary

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // Initialize the navigate function

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
      <div className="flex h-auto bg-gray-100 dark:bg-gray-900">
        <SideBar />
        <Outlet />
      </div>
    </UserProvider>
  );
};

export default Dashboard;
