import React, { useState} from 'react'

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div>
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
    </div>
  );
}

export default Login