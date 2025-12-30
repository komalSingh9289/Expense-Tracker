import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://expense-tracker-k5zz.onrender.com',
  withCredentials: true,
});
// const instance = axios.create({
//   baseURL: 'http://localhost:5001',
//   withCredentials: true,
// });

export const getFinancialInsight = async () => {
  const response = await instance.get("/ai/insight");
  return response.data;
};

export default instance;
