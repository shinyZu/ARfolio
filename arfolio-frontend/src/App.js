import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login/Login";

const App = () => {
  const handleLogin = (isSuccess, userRole) => {
    console.log("handleLogin");
    // console.log("App.js : " + isSuccess);

    // if (isSuccess && userRole === "Admin") {
    //   console.log("-------is Logged in as Admin------");
    //   setIsAdmin(true);
    // } else if (isSuccess && userRole === "Customer") {
    //   console.log("-------is Logged in as Customer------");
    //   setIsCustomer(true);
    // } else {
    //   console.log("-------is Logged out------");
    //   setIsAdmin(false);
    //   setIsCustomer(false);
    // }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login onLogin={handleLogin} />} />

      </Routes>
    </Router>
  );
}

export default App;
