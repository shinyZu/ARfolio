import axios from "../axios";
import qs from "qs";

import {jwtDecode} from "jwt-decode";
import LoginService from "./LoginService";
import TokenService from "./TokenService";

class UserService {

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
            .catch(async (er) => {
              // return resolve(er);

              if (er.response && er.response.status === 401 && er.response.data.message.name === 'TokenExpiredError') {
                // Before redirecting to the login page, attempt to logout the user
                let decodedToken = this.decodeToken();

                // get the refreshToken from localStorage
                const refresh_token = localStorage.getItem("refresh_token");

                let data = {
                  email : decodedToken.email,
                  refresh_token: JSON.parse(refresh_token)
                }

                // call API to refresh the expired access_token
                await TokenService.refreshToken(data)
                  .then((res) => {
                    console.log(res);
                    console.log('Token refreshed successfully.');
                    localStorage.setItem("token", JSON.stringify(res.data.response.access_token));
                    window.location.reload();

                  }).catch(async (err) => {
                    console.log('Failed to refresh the token:', err);

                    if (err.response && err.response.status === 401) {
                      await LoginService.logout(decodedToken.email)
                        .then((res) => {
                          console.log('User logged out successfully due to expired token.');
                          window.location.href = '/login'; // Redirect to the login page
    
                        }).catch(err => {
                          console.log('Failed to log out:', err);
                        });
                    }
                  });

              } else {
                console.log('An error occurred:', er.message);
                throw er;
              }
            });
        });
        return await promise;
    };

    registerUser = async (data) => {
      const promise = new Promise((resolve, reject) => {
        axios
          .post("users/register", data)
          .then((res) => {
            return resolve(res);
          })
          .catch((er) => {
            return resolve(er);
          });
      });
      return await promise;
    };

    updateUser = async (data, id) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // let id = token.user_id;
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

    updateUserImage = async (data, id) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // let id = token.user_id;
      console.log(id)
      const promise = new Promise((resolve, reject) => {
        axios
          .put("users/drive/url/db/" + id, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
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
    
    updateUserVideo = async (data, id) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // let id = token.user_id;
      console.log(id)
      const promise = new Promise((resolve, reject) => {
        axios
          .put("users/drive/url/db/video/" + id, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
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