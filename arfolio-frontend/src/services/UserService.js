import axios from "../axios";
import qs from "qs";

class UserService {
    getAll = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .get("users/getAll",{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            .then((res) => {
              return resolve(res);
            })
            .catch((er) => {
              return resolve(er);
            });
        });
        return await promise;
    };
    
    getUserById = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .get("users/"+id,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            .then((res) => {
              return resolve(res);
            })
            .catch((er) => {
              return resolve(er);
            });
        });
        return await promise;
    };

    updateUser = async (data) => {
      const token = JSON.parse(localStorage.getItem("token"));
      let id = token.user_id;
      console.log(id)
      const promise = new Promise((resolve, reject) => {
        axios
          .put("users/" + id, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
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

export default new UserService();