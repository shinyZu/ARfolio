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
import PortfolioForm from "./pages/PortfolioForm/PortfolioForm";

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
          path="/form"
          element={<PortfolioForm />}
        />

      </Routes>
    </Router>
  );
}

export default App;
