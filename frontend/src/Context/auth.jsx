import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Manage loading state

  const verifyUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001", null, {
        withCredentials: true,
      });
  
      console.log("API response:", res.data); // Log the API response
  
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("User verification error:", error.response ? error.response.data : error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    verifyUser(); // Call verifyUser when the component mounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
