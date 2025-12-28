import axios from "./axios";

export const getTransactions = async () => {
  try {
    const res = await axios.get("/transactions");
    return res.data.transactions;

  } catch (error) {
    console.log("error getting transactions : ", error);
  }
};

export const downloadTransactions = async () => {
  return axios.get("/transactions/export", {
    responseType: "blob",
  });
};


