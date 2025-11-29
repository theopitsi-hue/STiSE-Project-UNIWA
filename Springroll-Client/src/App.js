import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';

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
    <div className="App">
   
    </div>
  );
}

export default App;
