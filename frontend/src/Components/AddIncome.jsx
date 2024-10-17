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
    const res =  await addTransaction(incomeData);

    if(res.success){
      toast.success(res.message);
    }else{
      toast.warning(res.message);
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
    <div className="p-6">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-xs text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
      >
        <FaMoneyBillWave className="mr-2" />
        Add Income
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Add Income</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
           
            <select
              value={incomeData.categoryId}
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
              value={incomeData.description}
              onChange={handleChange}
              className="w-full text-xs p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Description"
            />
          </div>
          <div>
            
            <input
              type="number"
              name="amount"
              value={incomeData.amount}
              onChange={handleChange}
              className="w-full p-2 text-xs border border-gray-300 rounded-lg"
              placeholder="Enter amount"
            />
          </div>
          <div>
           
            <input
              type="date"
              name="date"
              value={incomeData.date}
              onChange={handleChange}
              className="w-full p-2 text-xs border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white text-xs px-4 py-2 rounded hover:bg-red-700 "
          >
            Add Income
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AddIncome;
