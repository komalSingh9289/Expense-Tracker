import React, { useEffect, useState } from "react";
import Modal from "./Modal"; // Import the shared Modal component
import { FaMoneyBillWave } from "react-icons/fa";
import  {toast,  ToastContainer } from "react-toastify";
import { getCategories } from "../api/getCategories";
import { useUser } from "../Context/UserContext";
import { addTransaction } from "../api/addTransaction";

const AddIncome = () => {
  const user = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const type = "Income";

  const [incomeData, setIncomeData] = useState({
    userId: user._id || '',
    categoryId: "",
    type: "income",
    description:"",
    amount: "",
    date: "",
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

  //console.log(categories);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIncomeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   // console.log(expenseData);
    const res = await addTransaction(incomeData);
    
    if (res?.success) {
      toast.success(res.message);
      setModalOpen(false);
    } else {
      toast.warning(res?.message || "Failed to add income");
    }

    setIncomeData({
      userId: user._id || '',
      categoryId: "",
      type: "income",
      description:"",
      amount: "",
      date: "",
    })

    setModalOpen(!isModalOpen);

  

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
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 ml-1">Category</label>
              <select
                value={incomeData.categoryId}
                name="categoryId"
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium"
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
