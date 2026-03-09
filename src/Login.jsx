import React, { useState } from "react";

function Login() {

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(loginData.email === "" || loginData.password === ""){
      alert("Please enter email and password");
      return;
    }

    alert("Login Successful!");
    console.log(loginData);
  };

  return (
    <div className="page">

      <h1>Login</h1>

      <form className="form" onSubmit={handleSubmit}>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={loginData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={loginData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

      </form>

    </div>
  );
}

export default Login;