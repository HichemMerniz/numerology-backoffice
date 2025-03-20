import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getNumerologyData = async (name: string, dob: string) => {
  try {
    const response = await axios.post(`${API_URL}/numerology`, { name, dob });
    return response.data;
  } catch (error) {
    console.error("Error fetching numerology data:", error);
  }
};