// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5 for the idea

import { useContext, createContext, useState, useEffect} from "react";

const AuthContext = createContext();



const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const [userdata, setUserdata] = useState([]);
    const [classrooms, setClassrooms] = useState([]); 

    //  ---     DATA FETCHERS     ---

    /**     User Data   {@link user}   */
    useEffect(() => {
            const fetchUserdata = async () => {
                try {
                    const res = await fetch("/api/user", {
                    method: 'GET',
                    // Include Token for Auth
                    headers: {
                        'Authorization': `Bearer ${token}`, 
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

    /**     Classroom Data   {@link classroom}   */
        useEffect(() => {
            const fetchClassrooms = async () => {
                try {
                    const res = await fetch(`api/classrooms?userId=${userdata.id}`);
                    const data = await res.json();

                    //For reasons beyond my understanding this is how the database data is parsed for the frontend - David
                    //TODO tweak this to be more universally usable
                    setClassrooms(
                        data.map(c => ({
                            id: c.ID,
                            name: c.Title,
                            description: c.Description,
                            type: "Classroom",  //  ???? - David
                        }))
                    );
                } catch (err) {
                    console.error("Failed to load classrooms:", err);
                }
            };
    
            fetchClassrooms();
        },);
        //TODO
        /**     Flashcards   {@link flashcard}   */
        
        /**     Quizzes   {@link quiz}   */

        /**     Questions   {@link question}   */




    //  ---     API FUNCTION CALLS     ---


    /**     Signup   {@link signup}   */
    const signupAction = async (req) => {
        try {
          const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });

        if (!res.ok) {
            console.error(`Error signing up: ${res.status}`);
            // TODO: Show an error message to the user (e.g., "Username taken")
            return;
        }

        const result = await res.json();
        console.log('Signup successful:', result);

        // TODO: Show a success message to the user
        // Redirect them to the login page
        window.location.href = '#/login';

        } catch (err) {
            console.error('Signup failed:', err);
            // TODO: Show a network error to the user
        }
  };

    /**     Login   {@link login}   */
    const loginAction = async (req) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            if (!res.ok) {
                alert("Server Error");
                console.error(`Error logging in: ${res.status}`);
                return; 
            }

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
}
    /**     Log Out   */ 
    const logOut = () => {
    setUserdata([])
    localStorage.removeItem("site");
    window.location.href = "/#/"
    }


    /**     Add Classroom to Database   {@link classroom}   */
    const addClassroom = async (payload) => { 
        try {
            const res = await fetch("/api/classrooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            
            const data = await res.json();

            if (!res.ok) {
                console.error("Error:", data);
                return;
            }

            setClassrooms(prev => [
                ...prev,
                {
                    id: data.ID,
                    name: data.Title,
                    description: data.Description,
                    type: "Classroom",
                }
            ]);

        }
        catch (err) {
            console.error("Request failed", err);
        }
    }
    //TODO
        /**     Add Flashcard to DB   {@link flashcard}   */
        
        /**     Create Quizzes   {@link quiz}   */

        /**     Create Questions   {@link question}   */
    

    const contextValue = {
    token,
    userdata,
    classrooms,

    signupAction,
    loginAction,
    logOut,
    addClassroom
  };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
