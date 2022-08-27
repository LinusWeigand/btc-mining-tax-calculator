import React from 'react';
import './App.css';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Bitcoin from "../Bitcoin/Bitcoin";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Inventory from '../../components/Inventory/Inventory';
function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <div className="app__body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Bitcoin />}/>
            <Route path="/home" element={<Bitcoin />} />
            <Route path="/tax" element={<Inventory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
