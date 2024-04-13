import axios from "../axios";
import qs from "qs";

class LinkHubService {

    saveLinks = async (data) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // let id = token.user_id;
      const promise = new Promise((resolve, reject) => {
        axios
          .post("linkhub/" , data, {
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

    updateLinks = async (data, id) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // let id = token.user_id;
      console.log(id)
      const promise = new Promise((resolve, reject) => {
        axios
          .put("linkhub/" + id, data, {
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

export default new LinkHubService();