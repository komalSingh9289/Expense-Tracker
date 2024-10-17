import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ErrorPage from "./Pages/Errorpage";
import AppLayout from "../src/Components/layout/AppLayout";
import Login from "./Pages/Login";
import OverView from "./Pages/OverView";
import DashboardLayout from "./Components/layout/DashboardLayout";
import Wallet from "./Pages/Wallet";
import Transactions from "./Pages/Transactions";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import { ThemeProvider } from "../src/Context/ThemeContext";
import Signup from "./Pages/Signup";
import { AuthProvider } from "./Context/auth";
import Logout from "./Pages/Logout";
import Profile from "./Pages/Profile";


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard/",
          element: <OverView />,
        },
        {
          path: "/dashboard/wallet",
          element: <Wallet />,
        },
        {
          path: "/dashboard/transactions",
          element: <Transactions />,
        },
        {
          path: "/dashboard/report",
          element: <Reports />,
        },
        {
          path: "/dashboard/settings",
          element: <Settings />,
        },
        {
          path: "/dashboard/profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
