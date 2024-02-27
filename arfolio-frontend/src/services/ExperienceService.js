import axios from "../axios";
import qs from "qs";

class ExperienceService {
    updateExperiencesAsBulk = async (data) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .put("experience/update/bulk", data, {
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
    
    deleteExperience = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .delete("experience/" + id, {
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

export default new ExperienceService();