import axios from "axios";

const API = axios.create({
  baseURL: "https://lost-and-found-portal-5erb.onrender.com/api",
});

export default API;