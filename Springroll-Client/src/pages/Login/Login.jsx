import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';


const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLoginMode
      ? "http://localhost:8080/api/account/auth/login"
      : "http://localhost:8080/api/account/auth/register";

    try {
      const body = isLoginMode
        ? { email, password }
        : { username, email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      showPopupMessage(data.message);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      if (isLoginMode) {
        showPopupMessage("Login successful! Welcome!");
        setTimeout(() => navigate('/stores'), 1000); // redirect after popup shows
      } else {
        showPopupMessage("Registration successful! Please log in.");
        setIsLoginMode(true);
        setUsername("");
        setPassword("");
        setEmail("");
      }

    } catch (err) {
      console.error(err);
      showPopupMessage(err.message || "Something went wrong");
    }
  }

  return (
    <div className="w-full max-w-[480px] mx-auto p-6 sm:p-8 bg-[#0f0f0f] rounded-2xl shadow-lg space-y-6 relative">

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-springGreenMedium text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center text-springOrange">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>
      </div>

      {/* Toggle Buttons */}
      <div className="relative flex h-12 mb-6 border border-springOrange rounded-full overflow-hidden">
        <button onClick={() => setIsLoginMode(true)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${isLoginMode ? "text-white" : "text-springOrange"}`}>
          Login
        </button>
        <button onClick={() => setIsLoginMode(false)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${!isLoginMode ? "text-white" : "text-springOrange"}`}>
          Sign Up
        </button>
        <div className={`absolute top-0 h-full w-1/2 rounded-full bg-springGreenMedium transition-all duration-300 ${isLoginMode ? "left-0" : "left-1/2"}`}>
        </div>
      </div>

      {/* Form Section */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLoginMode &&
          <input type="text" placeholder="Username" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
            value={username} onChange={(e) => setUsername(e.target.value)} />
        }

        <input type="email" placeholder="Email address" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {!isLoginMode &&
          <input type="password" placeholder="Confirm Password" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400" />
        }

        {isLoginMode &&
          <div className="text-right">
            <p className="text-springOrange hover:underline cursor-pointer">
              Forgot password?
            </p>
          </div>
        }

        {/* Submit Button */}
        <button className="w-full p-3 bg-springGreenMedium text-white rounded-full text-lg font-medium">
          {isLoginMode ? "Login" : "Sign Up"}
        </button>

        {/* Switch Mode Link */}
        <p className="text-center text-springRed">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <a
            href="#"
            onClick={e => { e.preventDefault(); setIsLoginMode(!isLoginMode); }}
            className="text-springOrange hover:underline">
            {isLoginMode ? "Sign Up" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
