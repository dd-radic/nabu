const fetchQuizQuestions = async (quizId) => {
     try {
        const res = await fetch(`/api/question?quizId=${quizId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });
        const data = await res.json();

        // If the response is not OK, log and stop
        if (!res.ok) {
            console.error('Failed to load all questions:', res.status, data);
            return;
        }
        console.log("Data from fetchQuizQuestions: ", data);
        return data;

    } catch (err) {
        console.error("Failed to load all questions:", err);
    }
};

const createQuestion = async (payload) => {
    try {
        const res = await fetch("/api/question", {
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


const questionController = {fetchQuizQuestions, createQuestion}
export default questionController;