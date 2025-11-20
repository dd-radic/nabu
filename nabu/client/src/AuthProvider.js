// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import { useContext, createContext, useState} from "react";
//import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    //const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");

    const loginAction = async (data) => {
        
        try {
            alert("Auth working");
            // Send the data to the /api/login endpoint on the server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Check if the server responded with an error
            if (!response.ok) {
                alert("Server Error");
                console.error(`Error logging in: ${response.status}`);
                // TODO: Show an error message to the user
                return; 
            }

            // Get the JSON response from the server (e.g., user data, token)
            const res = await response.json();
            console.log('Login successful: ', res);
        
            if (res.data){
                setUser(res.data.user);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                window.location.href = "/#/dashboard"
                //navigate("/dashboard");
                return;
            }
            throw new Error(res.message);
        } 
        catch (err) {
            console.error(err);
        }
        // TODO: Save the user's token and redirect to a dashboard
        // Example: localStorage.setItem('token', res.token);
        // Example: window.location.href = '/#/dashboard';
        
    }


    return <AuthContext.Provider value={{user, token, loginAction}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
