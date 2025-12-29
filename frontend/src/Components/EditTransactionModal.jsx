import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCategories } from "../api/getCategories";
import { updateTransaction } from "../api/addTransaction"; // Ensure this is exported from api/addTransaction

const EditTransactionModal = ({ isOpen, onClose, transaction, onUpdateSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        date: "",
        categoryId: "",
        type: "",
        file: null,
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: transaction.amount || "",
                date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : "",
                categoryId: transaction.categoryId?._id || transaction.categoryId || "", // Handle populated or raw ID
                type: transaction.type || "expense",
                file: null, // Reset file on new open
            });
            fetchCategories(transaction.type);
        }
    }, [transaction]);

    const fetchCategories = async (type) => {
        try {
            // getCategories expects 'Income' or 'Expense' (capitalized based on AddExpense/AddIncome usage)
            // but transaction.type might be lowercase. Let's capitalize it just in case, or check what getCategories expects.
            // Looking at AddExpense: const type = "Expense"; getCategories(type);
            // Looking at AddIncome: const type = "Income"; getCategories(type);
            const apiType = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "Expense";
            const fetchedCategories = await getCategories(apiType);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFormData((prev) => ({ ...prev, file: selectedFile }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Prepare data for update. Note: File update is not implemented in this simple version as per plan, 
            // but can be added if needed. For now, we update text fields.
            // using payload similar to addTransaction but without file for now unless we add file input.
            // The updateTransaction API we added accepts JSON or FormData? 
            // In transaction.controllers.js: const data = req.body;
            // It implies JSON is fine if we are not sending a file.
            // But if the backend expects FormData because of multer middleware?
            // existing addTransaction uses upload.single('file'). 
            // updateTransactions in backend uses req.body directly: const transaction = await Transaction.findByIdAndUpdate(id, data, ...);
            // It does NOT seem to use multer middleware in the route definition provided in previous turn?
            // Let's check router.
            // router.patch("/:id", protect, updateTransactions); -> No upload middleware.
            // So JSON is correct.

            const payload = new FormData();
            payload.append("description", formData.description);
            payload.append("amount", formData.amount);
            payload.append("date", formData.date);
            payload.append("categoryId", formData.categoryId);
            payload.append("type", formData.type);

            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await updateTransaction(transaction._id, payload);

            if (res?.success) {
                toast.success("Transaction updated successfully");
                onUpdateSuccess(res.transaction); // Pass back the updated transaction
                onClose();
            } else {
                toast.error(res?.message || "Failed to update transaction");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !transaction) return null;

    const isExpense = formData.type === "expense";
    const themeColor = isExpense ? "rose" : "emerald";

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight">
                    Edit {formData.type === "income" ? "Income" : "Expense"}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">
                            Category
                        </label>
                        <select
                            value={formData.categoryId}
                            name="categoryId"
                            onChange={handleChange}
                            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-${themeColor}-500/50 outline-none transition-all font-medium`}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-${themeColor}-500/50 outline-none transition-all font-medium`}
                            placeholder="Description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-${themeColor}-500/50 outline-none transition-all font-medium font-bold`}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-${themeColor}-500/50 outline-none transition-all font-medium`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">
                            Receipt (Optional)
                        </label>
                        <input
                            type="file"
                            name="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 text-sm focus:ring-2 focus:ring-${themeColor}-500/50 outline-none transition-all`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white font-bold rounded-2xl shadow-xl shadow-${themeColor}-500/20 active:scale-[0.98] transition-all duration-200 mt-4 flex justify-center items-center gap-2`}
                    >
                        {isLoading ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default EditTransactionModal;
