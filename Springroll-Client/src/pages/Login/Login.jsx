import React, { useState } from 'react'

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLoginMode
      ? "http://localhost:8080/api/account/auth/login"
      : "http://localhost:8080/api/account/auth/register";

    if (isLoginMode) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        console.log("User logged in:", data.message);

      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          })
        });

        if (!response.ok) {
          throw new Error("Register failed");
        }

        const data = await response.json();
        console.log("New user registered in:", data);

      } catch (err) {
        console.error(err);
      }
    }
  }


  return (
    <div className="w-full max-w-[480px] mx-auto p-6 sm:p-8 bg-[#0f0f0f] rounded-2xl shadow-lg space-y-6">

      {/* Header section */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center text-springOrange">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>
      </div>

      {/* Toggle Buttons */}
      <div className="relative flex h-12 mb-6 border border-springOrange rounded-full overflow-hidden">
        <button onClick={() => setIsLoginMode(true)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${isLoginMode ? "text-white" : "text-springOrange"
            }`
          }>
          Login
        </button>
        <button onClick={() => setIsLoginMode(false)}
          className={`w-1/2 text-lg font-medium transition-all z-10 ${!isLoginMode ? "text-white" : "text-springOrange"}`
          }>
          Sign Up
        </button>
        <div className={`absolute top-0 h-full w-1/2 rounded-full bg-springGreenMedium transition-all duration-300 ${isLoginMode ? "left-0" : "left-1/2"}`}>
        </div>
      </div>

      {/* Form Section */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLoginMode && <input type="text" placeholder="Username" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
          value={username} onChange={(e) => setUsername(e.target.value)} />}

        <input type="email" placeholder="Email address" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {!isLoginMode &&
          <input type="password" placeholder="Confirm Password" className="w-full p-3 border-2 border-gray-300 outline-none placeholder-gray-400" />}

        {isLoginMode &&
          <div className="text-right">
            <p className="text-springOrange hover:underline cursor-pointer">
              Forgot password?
            </p>
          </div>}
        {/* Submit Button & Switch Mode Link */}
        <button className="w-full p-3 bg-springGreenMedium text-white rounded-full text-lg font-medium">
          {isLoginMode ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-springRed">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <a
            href="#" onClick={e => {
              e.preventDefault(); setIsLoginMode(!isLoginMode)
            }
            } className="text-springOrange hover:underline">
            {isLoginMode ? "Sign Up" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login