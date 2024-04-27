import axios from "../axios";
import qs from "qs";

import {jwtDecode} from "jwt-decode";
import LoginService from "./LoginService";
import TokenService from "./TokenService";

class EducationService {

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

    getEducationByUserId = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .get("education/search/by/user",{
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

    updateEducationAsBulk = async (data) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .put("education/update/bulk", data, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              return resolve(res);
            })
            .catch(async(er) => {
              // return resolve(er);

              console.log(er)

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
    
    deleteEducation = async (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const promise = new Promise((resolve, reject) => {
          axios
            .delete("education/" + id, {
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

export default new EducationService();