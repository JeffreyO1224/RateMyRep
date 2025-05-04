import { useState } from 'react';
import React from "react";
import StateRep from "./StateRep.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import RepPage from './RepPage.jsx';
import BillPage from './BillPage.jsx';

const AppLayout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: isHomePage ? "center" : "initial",
        alignItems: isHomePage ? "center" : "initial",
        background: isHomePage ? "#f9f9f9" : "white",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<StateRep />} />
        <Route path="/members/:bioguideId/reps" element={<RepPage />} />
        <Route path="/bills/:billNumber" element={<BillPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
