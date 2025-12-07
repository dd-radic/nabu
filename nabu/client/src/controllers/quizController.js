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

const quizController = {createQuiz, }
export default quizController;