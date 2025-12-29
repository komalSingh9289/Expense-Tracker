import React from 'react';
import { FaMoneyBillWave, FaTimes } from 'react-icons/fa';

const DayTransactionsModal = ({ isOpen, onClose, date, transactions, loading, totalAmount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                            Transactions for {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Total Spent: <span className="font-bold text-slate-800 dark:text-white">₹{totalAmount.toLocaleString()}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-slate-500 text-sm">Loading transactions...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div
                                    key={tx._id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-lg
                      ${tx.type === 'expense' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}
                                        >
                                            <FaMoneyBillWave />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">
                                                {tx.categoryId?.title || "Uncategorized"}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {tx.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-lg ${tx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {tx.type === 'expense' ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <FaMoneyBillWave className="w-12 h-12 mb-4 opacity-20" />
                            <p>No transactions found for this date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayTransactionsModal;
