// radida01 2025-11-20
// credit to https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5 for the idea

import { useContext, createContext, useState, useEffect} from "react";
import classroomController from "./controllers/classroomController.js";
import signupController from "./controllers/signupController.js";
import loginController from "./controllers/loginController.js";
import dashboardController from "./controllers/dashboardController.js";
import quizController from "./controllers/quizController.js";
import flashcardController from "./controllers/flashcardController.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const [userdata, setUserdata] = useState(null);
    const [classrooms, setClassrooms] = useState([]); 
    const [quizdata, setQuizdata] = useState("");

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

            //Protect from invalid userdata
            if(!res.ok){
                setUserdata(null);

                //Nuke the token if the user is not authorized so that the reroutes work correctly
                if(res.status === 401 || res.status === 403){
                    setToken("");
                    localStorage.removeItem("site");
                }
                return;
            }

            const data = await res.json();
            setUserdata(data);

            } catch (err) {
                console.error("Failed to fetch userdata:", err);
                setUserdata(null);
            }
        };
            fetchUserdata();
    }, [token]);

    /**Classroom Data   {@link classroom}   */
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
        return res;
    }

    //TODO: Do the same thing for flaschards, quizzes, and questions
    /**     Flashcards   {@link flashcard}   */
    /**     Quizzes   {@link quiz}   */
    const loadContent = (userdata, classroomId, setContent) => {
        classroomController.loadContent(userdata, classroomId, setContent);
    };

    useEffect((  ) => {
        const fetchQuiz = async () => {
            try {           //TODO: i am so so sorry -David
                    const data = await quizController.fetchQuiz(window.location.hash.substring(7));
                    setQuizdata(data);
                } catch (error) {
                    console.error("Failed to fetch quiz data:", error);
                }
        };
            fetchQuiz();
    }, []);
    /**     Questions   {@link question}   */



    //============User Verification (signup/login) Routes ===============================================//


    /**     Signup   {@link signup}   */
    const signupAction = async (req) => {
        const creds = await signupController.signupAction(req);
        if (!creds) return;
        await loginController.loginAction(creds, setUserdata, setToken);
    };

    /**     Login   {@link login}   */
    const loginAction = async (req) => {loginController.loginAction(req, setUserdata, setToken)};
    /**     Log Out   */ 
    const logOut = async(req) => {loginController.logOut(setUserdata, setToken)};


    //==========Adding/Creation =====================================================//

    //For Classroom page
    const addClassroom = async(payload) => (await classroomController.addClassroom(payload, setClassrooms));
    const addUser = async(classroomId) => {
        await classroomController.addUser(userdata, classroomId)
    };
    const removeUser = async(classroomId) => (await classroomController.removeUser(userdata, classroomId));
    
    /**     Add Flashcard to DB   {@link flashcard}   */
    const createFlashcard = async(payload) => (await flashcardController.createFlashcard(payload, userdata));
    
    /**     Create Quizzes   {@link quiz}   */
    const createQuiz = async(payload) => (await quizController.createQuiz(payload));

    /**     Create Questions   {@link question}   */

    //============Update/Change========================================================//
    const updateUsername = async(userdata, newUsername) => (await dashboardController.updateUsername(userdata.id, newUsername));

    //============Deletion=============================================================//
    const deleteClassroom = async(classroomId) => (await classroomController.deleteClassroom(classroomId, setClassrooms));
    

    //=====================Return data ================================================//
    const contextValue = {
    token,
    userdata,
    classrooms,
    quizdata,

    signupAction,
    loginAction,
    logOut,

    addClassroom,
    deleteClassroom,
    fetchClassrooms,
    fetchAllClassrooms,
    addUser,
    removeUser,
    isMember,
    loadContent,

    createQuiz,

    createFlashcard,

    updateUsername,

  };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


//====================Exports =========================================================//
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
