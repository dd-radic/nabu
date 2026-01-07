const createFlashcard = async (payload, userdata) => {
    try {
        const res = await fetch(`/api/flashcard/create?userId=${userdata.id}`, {
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

const deleteFlashcard = async(flashCardId, creatorId) => {
    try{
        const res = await fetch(`/api/flashcard/delete?flashCardId=${flashCardId}&creatorId=${creatorId}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if(!res.ok){
            return null;
        }
        return data;
    } catch (err) {
        console.error("Delete flashcard error:", err);
        return null;
    }
}

const flashcardController = {createFlashcard, deleteFlashcard};
export default flashcardController;