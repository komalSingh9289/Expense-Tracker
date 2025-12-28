import axios from "axios";

// Helper to get token (if needed, but cookies are httpOnly, so we rely on browser sending them)
// Ensure axios sends credentials
axios.defaults.withCredentials = true;

export const getTransactions = async () => {
  try {
    const res = await axios.get("http://localhost:5001/transactions");
    return res.data.transactions;

  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export const downloadTransactions = async () => {
  return axios.get("http://localhost:5001/transactions/export", {
    responseType: "blob",
  });
};


