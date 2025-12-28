import React from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth"; // Import the AuthContext

const Logout = () => {
  const { setUser } = useAuth(); // Access setUser from the AuthContext
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const res = await axios.post("/logout", null);

      if (res.data.success) {
        setUser(null); // Clear the user state on successful logout
        console.log("Logout successful:", res.data.message);
        navigate("/login"); // Redirect to home or login page
      } else {
        console.log("Logout failed:", res.data.message);
      }
    } catch (error) {
      console.log(
        "Logout error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <button
      className="block px-4 py-2 text-sm text-left hover:bg-gray-200 w-full"
      onClick={handleClick}
    >
      Logout
    </button>
  );
};

export default Logout;
