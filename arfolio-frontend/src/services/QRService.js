import axios from "../axios"
import qs from "qs";

class QRService {
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