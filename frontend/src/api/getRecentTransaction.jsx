import axios from "axios";

axios.defaults.withCredentials = true;

export const getRecentTransactionsByUserId = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5001/transactions/recent"
    );
    return response.data.transactions;
  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export default getRecentTransactionsByUserId;
