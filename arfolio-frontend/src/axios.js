import axios from "axios";

const instance = axios.create({
  //   baseURL: "http://104.43.57.150:4000/az_news/api/v1/",
  baseURL: "http://localhost:4001/arfolio/api/v1/",
});

export default instance;