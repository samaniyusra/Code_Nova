import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});
export const signup = async (signupData) => {
    const response = await API.post("/signup", signupData);
    return response.data;
}
export const login = async (loginData) => {
    const response = await API.post("/login", loginData);
    return response.data;
}