import axiosInstance from "./axios";

export const addCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post("/categories", categoryData);
        return response.data;
    } catch (error) {
        console.error("Error adding category:", error);
        return error.response ? error.response.data : { success: false, message: "Server error" };
    }
};
