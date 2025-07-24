import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000", // Update if using a remote backend
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
