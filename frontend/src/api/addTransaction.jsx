import axios from "./axios";

export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      "/transactions",
      transactionData
    );
    return response.data;
  } catch (error) {
    console.log("error Adding the expense : ", error);
  }
};

// update transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await axios.patch(
      `/transactions/${id}`,
      transactionData
    );
    return response.data;
  } catch (error) {
    console.log("error Updating the expense : ", error);
  }
};

// remove transaction
export const removeTransaction = async (id) => {
  console.log(id);
  try {
    const response = await axios.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.log("error Removing the expense : ", error);
  }
};

// remove many transactions
export const removeManyTransactions = async (ids) => {
  try {
    const response = await axios.post("/transactions/delete-many", { ids });
    return response.data;
  } catch (error) {
    console.log("error Removing multiple expenses : ", error);
  }
};
