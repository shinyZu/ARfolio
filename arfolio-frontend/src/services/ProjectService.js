import axios from "../axios";
import qs from "qs";

class ProjectService {

    updateProjectsAsBulk = async (data) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .put("project/update/bulk", data, {
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
    
    deleteProject = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .delete("project/" + id, {
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

export default new ProjectService();