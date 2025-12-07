const createFlashcard = async (payload, userdata) => {
    try {
        const res = await fetch(`http://localhost:5000/api/flashcard/create?userId=${userdata.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) return null;
        return data;

    } catch (err) {
        console.error("POST flashcard error:", err);
        return null;
    }
};

const flashcardController = {createFlashcard, };
export default flashcardController;