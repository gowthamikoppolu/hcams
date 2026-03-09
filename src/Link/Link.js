import { BrowserRouter,Routes,Route} from "react-router-dom";
import Landing from "../Landing/Landing";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import About from "../About/About";
import Contact from "../Contact/Contact";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import PatientDashboard from "../PatientDashboard/PatientDashboard";


export default function Link(){
    return(
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Navbar" element={<Navbar/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/About" element={<About/>}/>
            <Route path="/Contact" element={<Contact/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Signup" element={<Signup/>}/>
            <Route path="/PatientDashboard" element={<PatientDashboard/>}/>
        </Routes>
        </BrowserRouter>
        </>
    )
}