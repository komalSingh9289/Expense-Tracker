import axios from "axios";

const getTransactions = async () => {
  try {
    const res = await axios.get("http://localhost:5001/transactions");
    return res.data.transactions;

  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export default getTransactions;
