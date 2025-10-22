import {Link} from "react-router-dom"

export function Navbar(){
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
        </div>
    );
}