import axios from "axios";

const getRecentTransaction = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5001/transactions/recent"
    );
    return response.data.transactions;
  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export default getRecentTransaction;
