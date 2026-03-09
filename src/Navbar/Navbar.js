import "./Navbar.css"
import { Link } from "react-router-dom";
export default function Navbar(){
    return(
        <>
            <nav>
                 <div className="Navbar">
                    <Link to="/Home">Home</Link>{"  "}
                    <Link to="/About">About</Link>{"  "}
                    <Link to="/Contact">Contact</Link>{"  "}
                    <Link to="/Login">Login</Link>{"  "}
                    <Link to="/Signup">Signup</Link>{"  "}
                    <Link to="/Dashboard">Dashboard</Link>{"  "}
                    <Link to="/PatientDashboard">Patient Dashboard</Link>{"  "}
                 </div>
            </nav>
        </>
    )
}