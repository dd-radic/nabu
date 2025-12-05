// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5 for the idea

import { useContext, createContext, useState, useEffect} from "react";
import classroomController from "./controllers/classroomController.js";
import signupController from "./controllers/signupController.js";
import loginController from "./controllers/loginController.js";


const AuthContext = createContext();



const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const [userdata, setUserdata] = useState([]);
    const [classrooms, setClassrooms] = useState([]); 

    // ======================Data fetching ============================================//

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
        useEffect(() => {classroomController.fetchClassrooms(userdata, setClassrooms)}, [userdata]);

    //TODO: Do the same thing for flaschards, quizzes, and questions

        //TODO
/**     Flashcards   {@link flashcard}   */

/**     Quizzes   {@link quiz}   */

/**     Questions   {@link question}   */



    //============User Verification (signup/login) Routes ===============================================//


    /**     Signup   {@link signup}   */
    const signupAction = async (req) => {signupController.signupAction(req)};

    /**     Login   {@link login}   */
    const loginAction = async (req) => {loginController.loginAction(req, setUserdata, setToken)};
    /**     Log Out   */ 
    const logOut = async(req) => {loginController.logOut(setUserdata)};


    //==========Adding/Creation =====================================================//

    //TODO: A more elegant way to do this would be nice, but might require some hardcore refactoring
    const addClassroom = async(payload) => (await classroomController.addClassroom(payload, setClassrooms));

    const addUser = async(classroomId) => (await classroomController.addUser(userdata, classroomId));
    const removeUser = async(classroomId) => (await classroomController.removeUser(userdata, classroomId));
    
    //TODO
        /**     Add Flashcard to DB   {@link flashcard}   */
        
        /**     Create Quizzes   {@link quiz}   */

        /**     Create Questions   {@link question}   */
    


    //=====================Return data ================================================//
    const contextValue = {
    token,
    userdata,
    classrooms,

    signupAction,
    loginAction,
    logOut,
    addClassroom,
    addUser,
    removeUser
  };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


//====================Exports =========================================================//
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
