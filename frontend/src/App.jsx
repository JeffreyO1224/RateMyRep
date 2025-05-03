import { useState } from 'react';
import React from "react";
import StateRep from "./StateRep.jsx";
import BillsPage from './BillsPage.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<StateRep />} />
          <Route path="/members/:bioguideId/bills" element={<BillsPage />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App
