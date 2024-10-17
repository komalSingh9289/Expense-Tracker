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
  const [selectedCategory, setSelectedCategory] = useState("");
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

    // Create a new FormData object for file upload
    const formData = new FormData();
    formData.append("userId", expenseData.userId);
    formData.append("categoryId", expenseData.categoryId);
    formData.append("type", expenseData.type);
    formData.append("description", expenseData.description);
    formData.append("amount", expenseData.amount);
    formData.append("date", expenseData.date);
    if (file) {
      formData.append("file", file); // Append the file to formData
    }

    const res = await addTransaction(formData);

    if (res && res.data && res.data.success) {
      toast.success(res.data.message);
    } else {
      toast.warning(res.data.message || "Something went wrong");
    }

    setExpenseData({
      userId: user._id || '',
      categoryId: "",
      type: "expense",
      description: "",
      amount: "",
      date: "",
    });

    setFile(null); // Clear the file after submission
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
      >
        <FaMoneyBillWave className="mr-2" />
        Add Expense
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-bold mb-2">Add Expense</h2>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <select
              value={expenseData.categoryId}
              name="categoryId"
              onChange={handleChange}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg"
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
            <input
              type="text"
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Description"
            />
          </div>
          <div>
            <input
              type="number"
              name="amount"
              value={expenseData.amount}
              onChange={handleChange}
              className="w-full  text-xs p-2 border border-gray-300 rounded-lg"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <input
              type="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Upload Supporting Document (Bills/Invoices)
            </label>
            <input
              type="file"
              name="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-xs text-white px-4 py-2 rounded hover:bg-red-700 "
          >
            Add Expense
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AddExpense;
