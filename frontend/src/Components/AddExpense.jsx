import React, { useEffect, useState } from "react";
import Modal from "./Modal"; // Import the shared Modal component
import { FaMoneyBillWave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { getCategories } from "../api/getCategories";
import { useUser } from "../Context/UserContext";
import { addTransaction } from "../api/addTransaction";

const AddExpense = () => {
  const user = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const type = "Expense";

  const [expenseData, setExpenseData] = useState({
    userId: user._id || '',
    categoryId: "",
    type: "expense",
    description: "",
    amount: "",
    date: "",
    file: null, // Include the file in the expense data
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories(type);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Set the file to state
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!user?._id) {
      toast.error("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("categoryId", expenseData.categoryId);
    formData.append("type", "expense");
    formData.append("description", expenseData.description);
    formData.append("amount", expenseData.amount);
    formData.append("date", expenseData.date);

    if (file) {
      formData.append("file", file);
    }

    const res = await addTransaction(formData);

    if (res?.success) {
      toast.success(res.message);
      setModalOpen(false);
    } else {
      toast.warning(res?.message || "Failed to add expense");
    }

    setExpenseData({
      userId: user._id,
      categoryId: "",
      type: "expense",
      description: "",
      amount: "",
      date: "",
    });

    setFile(null);
  } catch (error) {
    console.error("Add expense error:", error);
    toast.error("Server error. Please try again.");
  }
};


  return (
    <div className="p-4">
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all duration-200"
      >
        <FaMoneyBillWave />
        <span>Add Expense</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-2">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight">Add Expense</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Category</label>
              <select
                value={expenseData.categoryId}
                name="categoryId"
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-medium"
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
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Description</label>
              <input
                type="text"
                name="description"
                value={expenseData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-medium"
                placeholder="What was this for?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-medium font-bold"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={expenseData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Receipt (Optional)</label>
              <input
                type="file"
                name="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              Confirm Expense
            </button>
          </form>
        </div>
      </Modal>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default AddExpense;
