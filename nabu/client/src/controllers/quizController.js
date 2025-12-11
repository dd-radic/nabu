const createQuiz = async (payload) => {
    try {
        const res = await fetch("http://localhost:5000/api/quizzes", {
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


const quizController = {createQuiz, fetchQuiz}
export default quizController;