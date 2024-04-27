import axios from "../axios"
import qs from "qs";

import {jwtDecode} from "jwt-decode";
import LoginService from "./LoginService";
import TokenService from "./TokenService";

class QRService {

    // Function to decode the JWT token
    decodeToken = () => {
      try {
          const token = localStorage.getItem("token");
          const decodedToken = jwtDecode(token);
          console.log(decodedToken);
          return decodedToken;
      } catch (error) {
          console.error("Error decoding JWT token:", error);
          return null;
      }
    };
    
    generateBase64 = async (user_id) => {
        // let data = {params:{user_id:user_id}}
        const promise = new Promise((resolve, reject) => {
          axios
            .get("qrcode/generate/base64", {params:{user_id:user_id}})
            .then((res) => {
              return resolve(res);
            })
            .catch((er) => {
              return resolve(er);
            });
        });
        return await promise;
      };
}

export default new QRService();