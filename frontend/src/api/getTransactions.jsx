import axios from "./axios";

export const getTransactions = async () => {
  try {
    const res = await axios.get("/transactions");
    return res.data.transactions;

  } catch (error) {
    console.log("error fetching transactions", error);
    return [];
  }
};


export const getTransactionsByDate = async (date) => {
  try {
    const response = await axios.post(`/transactions/get-by-date`, { date });
    return response.data;
  } catch (error) {
    console.log("error fetching transactions by date", error);
  }
};

export const downloadTransactions = async () => {
  return axios.get("/transactions/export", {
    responseType: "blob",
  });
};


