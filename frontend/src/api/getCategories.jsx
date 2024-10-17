import axios from "axios";

export const getCategories = async (sourceType) => {
  try {
    const response = await axios.get(`http://localhost:5001/categories/${sourceType}`);
    return response.data.categories;

  } catch (error) {
    console.log("Error fetching categories : ", error);
    
  }
};
