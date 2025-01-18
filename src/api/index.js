import axios from "axios";
import Categories from "./category";
import Cart from "./cart";
import User from "./user";
import Catalog from "./catalog";
import Documents from "./documents";
import Orders from "./orders";

export const checkValidTime = (date) => {
  if (!date) return;

  const givenDate = new Date(date * 1000);
  const currentDate = new Date();

  return givenDate.getTime() >= currentDate.getTime();
};

const baseUrl = "https://ecomm.devicefi.com/api/v1/";


const coreAxiosInstance = axios.create({
  baseURL: `${baseUrl}`,
});



coreAxiosInstance.interceptors.request.use(async (request) => {
  
  const token = localStorage.getItem("devicefi_token");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  return request;
});



coreAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response);
    if (error.response.data.message === "Unauthorized - access_token override") {
      localStorage.setItem("user", null);
      localStorage.setItem("devicefi_token", null);
      localStorage.setItem("expired", null);
    }
    return Promise.reject(error);
  }
);

export default {
  categories: new Categories(coreAxiosInstance),
  cart: new Cart(coreAxiosInstance),
  user: new User(coreAxiosInstance),
  catalog: new Catalog(coreAxiosInstance),
  document: new Documents(coreAxiosInstance),
  orders: new Orders(coreAxiosInstance),
};