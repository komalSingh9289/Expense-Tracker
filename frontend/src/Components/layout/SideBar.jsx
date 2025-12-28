import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaChartPie, FaDollarSign, FaClipboardList, FaCog } from 'react-icons/fa';
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { Navigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const user = useUser();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FaChartPie className="h-5 w-5" /> },
        { path: "/dashboard/transactions", label: "Transactions", icon: <FaDollarSign className="h-5 w-5" /> },
        { path: "/dashboard/wallet", label: "Wallet", icon: <FaClipboardList className="h-5 w-5" /> },
        { path: "/dashboard/report", label: "Reports", icon: <FaChartPie className="h-5 w-5" /> },
        { path: "/dashboard/settings", label: "Settings", icon: <FaCog className="h-5 w-5" /> },
       
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="relative z-40">
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white w-64 h-full transition-all duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static'
                } z-50 flex flex-col`}
            >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        ExpenseMate
                    </NavLink>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <AiOutlineClose className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                                    : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'
                                }`
                            }
                        >
                            <span className="mr-3 transition-transform group-hover:scale-110">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                    {/* logout function  */}
                   <button
  onClick={handleLogout}
  className="flex items-center w-full p-3 rounded-xl transition-all duration-200 group text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"
>
  <span className="mr-3 transition-transform group-hover:scale-110">
    <FiLogOut className="h-5 w-5" />
  </span>
  <span className="font-medium">Logout</span>
</button>

                </nav>

                <div className="border-t border-slate-200 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`md:hidden p-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl fixed bottom-6 right-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-transform hover:scale-110 active:scale-95 ${
                    isOpen ? 'scale-0' : 'scale-100'
                }`}
            >
                <AiOutlineMenu className="h-6 w-6" />
            </button>
        </div>
    );
};

export default Sidebar;
