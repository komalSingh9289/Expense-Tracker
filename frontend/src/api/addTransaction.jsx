import axios from "axios";

export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/transactions",
      transactionData
    );
    return response.data;
  } catch (error) {
    console.log("error Adding the expense : ", error);
  }
};
