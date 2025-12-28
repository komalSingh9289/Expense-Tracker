import axios from "./axios";

export const getRecentTransactionsByUserId = async () => {
  try {
    const response = await axios.get(
      "/transactions/recent"
    );
    return response.data.transactions;
  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export default getRecentTransactionsByUserId;
