import axios from "../axios"
import qs from "qs";

class LoginService {
    login = async (data) => {
        const promise = new Promise((resolve, reject) => {
          axios
            .post("login", data)
            .then((res) => {
              return resolve(res);
            })
            .catch((er) => {
              return resolve(er);
            });
        });
        return await promise;
      };

      logout = async (email) => {
        const promise = new Promise((resolve, reject) => {
          axios
            .delete("login/logout/" + email)
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

export default new LoginService();