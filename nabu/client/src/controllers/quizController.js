const createQuiz = async (payload) => {
    try {
        const res = await fetch("/api/quizzes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) return null;
        return data;

    } catch (err) {
        console.error("POST quiz error:", err);
        return null;
    }
};

const fetchQuiz = async (quizId) => {
     try {
        const res = await fetch(`/api/quizzes/getCurrent?quizId=${quizId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });
        const data = await res.json();

        // If the response is not OK, log and stop
        if (!res.ok) {
            console.error('Failed to load all quizzes:', res.status, data);
            return;
        }
        console.log("Data from fetchQuiz: ", data);
        return data;
        //setQuizdata(data);

    } catch (err) {
        console.error("Failed to load all quizzes:", err);
    }
};

const isComplete = async (quizId, userId) => {
    try{
        const res = await fetch(`/api/quizzes/getCurrent?quizId=${quizId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });
        const quiz = await res.json();
        const classroomId = quiz.ClassRoomId;
    }
    catch (err) {
        console.error("Error in isComplete func", err);
    }
}

const complete = async(quizId, userId) => {
    try{
        const res = await fetch(`/api/quizzes/getCurrent?quizId=${quizId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });
        const quiz = await res.json();
        const classroomId = quiz.ClassRoomId;

        let payload = [userId, quizId]
        
        await fetch(`/api/quizzes/getCurrent/markComplete`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(payload)
        });
        
        //Determine the EXP this quiz should drop. correct is the ratio of correct answers
        const dexp = Math.round((20*(quiz.Yield || 100)/7));

        //Adjust the user's overall EXP level
        await fetch(`/api/user/updateExp?userId=${userId}&dexp=${dexp}`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
        });

        //Check if the user completed a quiz from a classroom they are part of, if so, update their exp within the classroom
        await fetch(`/api/classrooms/updateScore?userId=${userId}&classroomId=${classroomId}&dexp=${dexp}`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
        });

    } catch (err) {
        console.error("Error completing quiz:", err);
    }
};

const deleteQuiz = async(quizId, userId) => {
    try{
        const res = await fetch(`/api/quizzes/delete?quizId=${quizId}&creatorId=${userId}`, {
            method: 'DELETE'
        });
        
        if(!res.ok){
            console.error("Error deleting quiz");
            return;
        }
    } catch(err){
        console.error("Error deleting quiz:", err);
    }
}

const quizController = {createQuiz, fetchQuiz, complete, deleteQuiz, isComplete}
export default quizController;