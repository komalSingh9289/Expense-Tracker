import React, { useEffect, useState } from "react";
import Modal from "./Modal"; // Import the shared Modal component
import { FaMoneyBillWave } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { getCategories } from "../api/getCategories";
import { useUser } from "../Context/UserContext";
import { addTransaction } from "../api/addTransaction";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../api/addCategory";

const AddIncome = () => {
  const user = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const type = "Income";
  const navigate = useNavigate();

  const [incomeData, setIncomeData] = useState({
    userId: user?._id || '',
    categoryId: "",
    type: "income",
    description: "",
    amount: "",
    date: "",
  });

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories(type);
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedCat = categories.find(c => c._id === value);
      if (selectedCat && selectedCat.title.toLowerCase() === "other") {
        setShowCustomCategory(true);
      } else {
        setShowCustomCategory(false);
      }
    }

    setIncomeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user?._id) {
        toast.error("User not logged in");
        return;
      }

      let finalCategoryId = incomeData.categoryId;

      // Create custom category if needed
      if (showCustomCategory && customCategory.trim()) {
        const resCat = await addCategory({
          title: customCategory,
          sourceType: "Income"
        });

        if (resCat.success) {
          finalCategoryId = resCat.category._id;
        } else {
          toast.warning(resCat.message || "Could not create custom category. Using 'Other'. Or try again.");
          if (resCat.message.includes("similar") || resCat.message.includes("exists")) {
            return;
          }
        }
      }

      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("categoryId", finalCategoryId);
      formData.append("type", "income");
      formData.append("description", incomeData.description);
      formData.append("amount", incomeData.amount);
      formData.append("date", incomeData.date);

      const res = await addTransaction(formData);

      if (res?.success) {
        toast.success(res.message);
        setModalOpen(false);
        // Refresh categories
        const updatedCats = await getCategories(type);
        setCategories(updatedCats || []);
      } else {
        toast.warning(res?.message || "Failed to add income");
      }

      setIncomeData({
        userId: user?._id || '',
        categoryId: "",
        type: "income",
        description: "",
        amount: "",
        date: "",
      })
      setCustomCategory("");
      setShowCustomCategory(false);
      navigate('/dashboard/transactions');
    } catch (error) {
      console.error("Add income error:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
      >
        <FaMoneyBillWave />
        <span>Add Income</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-2">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white tracking-tight">Add Income</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Category</label>
              <div
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium cursor-pointer flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                <span>
                  {incomeData.categoryId
                    ? categories.find(c => c._id === incomeData.categoryId)?.title
                    : "Select a category"}
                </span>
                <span className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-40 overflow-y-auto scrollbar-hide py-1">
                    {categories.length === 0 ? (
                      <div className="px-4 py-3 text-slate-400 text-sm italic">No categories found</div>
                    ) : (
                      categories.map((category) => (
                        <div
                          key={category._id}
                          onClick={() => {
                            handleChange({ target: { name: "categoryId", value: category._id } });
                            setDropdownOpen(false);
                          }}
                          className={`px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer transition-colors text-slate-700 dark:text-slate-200 text-sm font-medium ${incomeData.categoryId === category._id ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : ''
                            }`}
                        >
                          {category.title}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {showCustomCategory && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">New Category Name</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium"
                  placeholder="Enter custom category"
                  maxLength={20}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Description</label>
              <input
                type="text"
                name="description"
                value={incomeData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium"
                placeholder="Where did this come from?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={incomeData.amount}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium font-bold"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={incomeData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              Confirm Income
            </button>
          </form>
        </div>
      </Modal>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default AddIncome;
