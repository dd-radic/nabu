import {Link} from "react-router-dom"

export function Navbar(){
    const handleLogout = () => {
   
    localStorage.removeItem("accessToken");

    
    // localStorage.clear();

    
    window.location.href = "/login";
    console.log("User logged out");
  };
    
    return(
        <div>
            <Link to='/'>
                <button>Home</button>
            </Link>
            <Link to="/login">
                <button>Log In</button>
            </Link>
            <Link to="/signup">
                <button>Sign Up</button>
            </Link>
             <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}