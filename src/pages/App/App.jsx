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
function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <div className="app__body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Bitcoin />}/>
            <Route path="/bitcoin" element={<Bitcoin />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
