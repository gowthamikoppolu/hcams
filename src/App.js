import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";

import Navbar from "./Navbar";

import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Doctors from "./Doctors";
import Patients from "./Patients";
import Appointments from "./Appointments";
import MedicalRecords from "./MedicalRecords";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import Contact from "./Contact";

function App(){

  return(

    <BrowserRouter>

      <Navbar/>

      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/patients" element={<Patients/>}/>
        <Route path="/appointments" element={<Appointments/>}/>
        <Route path="/records" element={<MedicalRecords/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact" element={<Contact/>}/>

      </Routes>

    </BrowserRouter>

  )
}

export default App