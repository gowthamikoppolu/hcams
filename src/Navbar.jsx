import React from "react";
import { Link } from "react-router-dom";

function Navbar(){

  return(
    <div className="navbar">

      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/services">Services</Link>
      <Link to="/doctors">Doctors</Link>
      <Link to="/patients">Patients</Link>
      <Link to="/appointments">Appointments</Link>
      <Link to="/records">Medical Records</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/contact">Contact</Link>

    </div>
  )
}

export default Navbar