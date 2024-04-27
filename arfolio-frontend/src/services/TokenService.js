import axios from "../axios"
import qs from "qs";

class TokenService {
    refreshToken = async (data) => {
        const promise = new Promise((resolve, reject) => {
          axios
            .post("token/refresh", data)
            .then((res) => {
              return resolve(res);
            })
            .catch((er) => {
              return resolve(er);
            });
        });
        return await promise;
      };

      generateToken = async (data) => {
        const promise = new Promise((resolve, reject) => {
          axios
            .post("token/generateToken", data)
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

export default new TokenService();