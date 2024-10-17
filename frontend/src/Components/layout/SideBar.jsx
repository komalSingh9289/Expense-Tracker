import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaChartPie, FaDollarSign, FaClipboardList, FaCog } from 'react-icons/fa';
import { FaUserEdit } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null); // Create a ref for the sidebar

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Close sidebar on link click
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Close sidebar on outside click
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        // Attach event listener to detect clicks outside the sidebar
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex z-10">
            {/* Sidebar */}
            <div
                ref={sidebarRef} // Attach the ref to the sidebar
                className={`fixed inset-y-0 overflow-y-scroll overflow-x-hidden left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-64 h-full transition-transform duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Toggle button inside the sidebar when open */}
                {isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className={`p-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg absolute top-2 mb-3 right-4 z-10 transition-transform duration-300 ease-in-out`}
                    >
                        <AiOutlineClose className="h-4 w-4" />
                    </button>
                )}

                <div className="p-3 mt-3">
                    <NavLink to="/" className="text-xl font-semibold">
                        Expense Tracker
                    </NavLink>
                </div>
                <nav className="mt-2">
                    <ul>
                    <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaUserEdit  className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard/profile" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Profile
                            </NavLink>
                        </li>
                        <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaChartPie className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaDollarSign className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard/transactions" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Transactions
                            </NavLink>
                        </li>
                        <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaClipboardList className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard/wallet" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Wallet
                            </NavLink>
                        </li>
                        <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaChartPie className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard/report" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Reports
                            </NavLink>
                        </li>
                        <li className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                            <FaCog className="h-4 w-4 mr-2" />
                            <NavLink to="/dashboard/settings" className='text-sm' activeclassname="font-bold text-gray-500 dark:text-gray-300" onClick={handleLinkClick}>
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Toggle button outside the sidebar when closed */}
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className={`p-2 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg absolute top-2 mb-3 left-4 z-10 transition-transform duration-300 ease-in-out`}
                >
                    <AiOutlineMenu className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
