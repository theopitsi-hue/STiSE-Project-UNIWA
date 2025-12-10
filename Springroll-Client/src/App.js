import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Payment from './pages/Payment/Payment';

function App() {
  const [users, setUser] = useState();

  useEffect(() => {
    console.log("Hewowoowoww");
  })

  const getTest = async () => {
    try {
      const response = await api.get("/root")
      setTest(response.data);
      console.log(response.data);

    } catch (err) {
      console.log(err);
    }

  }

  return (
     <Router>
      <div className="grid w-full h-screen place-items-center bg-gradient-to-br from-springGreen via-springOrange to-springRed">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />

          {/* Default route (optional) */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
