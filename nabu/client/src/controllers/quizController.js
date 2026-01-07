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

const complete = async(quizId, userId, correct) => {
    try{
        const res = await fetch(`/api/quizzes/getCurrent?quizId=${quizId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });
        const quiz = await res.json();
        const classroomId = quiz.classroomId;

        //Determine the EXP this quiz should drop. correct is the ratio of correct answers
        const dexp = Math.round((20*quiz.yield/7)*correct);

        //Adjust the user's overall EXP level
        await fetch(`/api/user/updateExp?userId=${userId}&dexp=${dexp}`);

        //Check if the user completed a quiz from a classroom they are part of, if so, update their exp within the classroom
        await fetch(`/api/classroom/updateScore?userId=${userId}&classroomId=${classroomId}&dexp=${dexp}`);

    } catch (err) {
        console.error("Error completing quiz:", err);
    }
};

const quizController = {createQuiz, fetchQuiz, complete}
export default quizController;