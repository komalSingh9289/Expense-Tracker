import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTransactionsByDate } from "../api/getTransactions"; // Import API
import DayTransactionsModal from "./DayTransactionsModal";

const Calendar = ({ transactions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [dayTransactions, setDayTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // Helper to get days in month
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];

        // Fill previous month padding days
        const firstDayIndex = date.getDay();
        for (let x = firstDayIndex; x > 0; x--) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        setDaysInMonth(days);
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Check if a specific date has expenses using the transactions prop (for indicators)
    const hasExpense = (date) => {
        if (!date || !transactions) return false;
        const targetDate = date.toISOString().split('T')[0];
        return transactions.some(t => {
            const tDate = new Date(t.date).toISOString().split('T')[0];
            return tDate === targetDate;
        });
    };

    const handleDateClick = async (date) => {
        if (!date) return;

        setSelectedDate(date);
        setModalOpen(true);
        setLoading(true);

        // Create a local date string "YYYY-MM-DD" to avoid timezone shifts
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];

        try {
            const res = await getTransactionsByDate(dateString);
            if (res && res.success) {
                setDayTransactions(res.transactions);
                setTotalAmount(res.totalAmount);
            } else {
                setDayTransactions([]);
                setTotalAmount(0);
            }
        } catch (error) {
            console.error("Failed to fetch day transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-slate-600 dark:text-slate-400">
                        <FaChevronLeft />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-slate-600 dark:text-slate-400">
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {weekDays.map(day => (
                    <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, index) => (
                    <div key={index} className="aspect-square">
                        {date ? (
                            <button
                                onClick={() => handleDateClick(date)}
                                className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                  ${hasExpense(date)
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-400"}
                  ${selectedDate && date.toDateString() === selectedDate.toDateString() ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900" : ""}
                `}
                            >
                                <span className="text-sm font-bold">{date.getDate()}</span>
                                {hasExpense(date) && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                )}
                            </button>
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                ))}
            </div>

            <DayTransactionsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                date={selectedDate}
                transactions={dayTransactions}
                loading={loading}
                totalAmount={totalAmount}
            />
        </div>
    );
};

export default Calendar;
