import React, { useState} from 'react'

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
     <div>
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
      
      {/* Toggle Buttons */}
      <div>
        <button onClick={() => setIsLoginMode(true)}>
            Login
        </button>
        <button onClick={() => setIsLoginMode(false)}>
            Sign Up
        </button>
      </div>

      {/* Form Fields */}
      <form>
        {!isLoginMode && 
            <input placeholder="Name" />}
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
        {!isLoginMode && 
            <input type="password" placeholder="Confirm Password" />}

        <button type="submit">
            {isLoginMode ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Login