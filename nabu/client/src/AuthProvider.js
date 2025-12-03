// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import { useContext, createContext, useState, useEffect} from "react";
//import { useNavigate } from "react-router-dom";

const AuthContext = createContext();



const AuthProvider = ({ children }) => {
    //const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const [userdata, setUserdata] = useState([]);

    useEffect(() => {
            const fetchUserdata = async () => {
                try {
                    const res = await fetch("/api/user", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Include the token in the request header
                    },
                });
                const data = await res.json();
                setUserdata(data);
                } catch (err) {
                    console.error("Failed to fetch userdata:", err);
                }
            };
    
            fetchUserdata();
        }, [token]);

    const loginAction = async (req) => {
        
        try {
            // Send the data to the /api/login endpoint on the server
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            // Check if the server responded with an error
            if (!res.ok) {
                alert("Server Error");
                console.error(`Error logging in: ${res.status}`);
                // TODO: Show an error message to the user
                return; 
            }

            // Get the JSON res from the server (e.g., user data, token)
            const data = await res.json();

            if (data){
                setUserdata(data)
                setToken(data.token)
                localStorage.setItem("site", data.token);

                window.location.href = "/#/dashboard"
                return;
            }
            throw new Error(data.message);
        } 
        catch (err) {
            console.error(err);
        }
        // TODO: Save the user's token and redirect to a dashboard
        // Example: localStorage.setItem('token', res.token);
        // Example: window.location.href = '/#/dashboard';
        
    }

    const logOut = () => {
    setUserdata([])
    localStorage.removeItem("site");
    window.location.href = "/#/"
    //navigate("/login");
    }

    const contextValue = {
    token,
    loginAction,
    logOut,
    userdata
  };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
