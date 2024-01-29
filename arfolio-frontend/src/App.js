import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import BasicDetails from "./pages/PortfolioForm/BasicDetails/BasicDetails";
import EducationDetails from "./pages/PortfolioForm/Education/EducationDetails";

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
        <Route path="/" exact element={<Navigate replace to="/home" />} />

        <Route path="/home" element={<Home handleLogin={handleLogin} />} />
        
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        
        <Route
          path="/register"
          element={<Register onLogin={handleLogin} />}
        />
        
        <Route
          path="/basic"
          element={<BasicDetails />}
        />
        
        <Route
          path="/education"
          element={<EducationDetails />}
        />

      </Routes>
    </Router>
  );
}

export default App;
