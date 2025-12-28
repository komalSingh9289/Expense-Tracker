import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://expense-tracker-k5zz.onrender.com',
  withCredentials: true,
});

export default instance;
