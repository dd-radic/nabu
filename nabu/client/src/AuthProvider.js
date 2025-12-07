// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5 for the idea

import { useContext, createContext, useState, useEffect} from "react";
import classroomController from "./controllers/classroomController.js";
import signupController from "./controllers/signupController.js";
import loginController from "./controllers/loginController.js";
import quizController from "./controllers/quizController.js";
import flashcardController from "./controllers/flashcardController.js";


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
        const fetchClassrooms = () => {classroomController.fetchClassrooms(userdata, setClassrooms)};
        const fetchAllClassrooms = () => {classroomController.fetchAllClassrooms(setClassrooms)};
        //By default, state classrooms is set to ALL (change later if needed)
        useEffect(() => {
            if(!userdata){
                //If the classrooms have not loaded yet, leave before the system freaks out
                setClassrooms([]);
                return;
            }
            classroomController.fetchAllClassrooms(setClassrooms)
        }, [userdata]);

        const isMember = async (classroomId) => {
            const res = await classroomController.isMember(userdata, classroomId);
            console.log("AuthProvider: ", res);
            return res;
        }

    //TODO: Do the same thing for flaschards, quizzes, and questions

        //TODO
    /**     Flashcards   {@link flashcard}   */
    /**     Quizzes   {@link quiz}   */
    const loadContent = (classroomId, setContent) => {classroomController.setContent(userdata, classroomId, setContent)};

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

    const addUser = async(classroomId) => {
        await classroomController.addUser(userdata, classroomId)
    };
    const removeUser = async(classroomId) => (await classroomController.removeUser(userdata, classroomId));
    
    //TODO
        /**     Add Flashcard to DB   {@link flashcard}   */
        const createFlashcard = async(payload) => (await flashcardController.createFlashcard(payload, userdata));
        
        /**     Create Quizzes   {@link quiz}   */
        const createQuiz = async(payload) => (await quizController.createQuiz(payload));

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
    fetchClassrooms,
    fetchAllClassrooms,
    addUser,
    removeUser,
    isMember,
    loadContent,

    createQuiz,

    createFlashcard,

  };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


//====================Exports =========================================================//
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
