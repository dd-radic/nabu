const fetchClassrooms = async (userdata, setClassrooms) => {
    try {
        const res = await fetch(`api/classrooms?userId=${userdata.id}`);
        const data = await res.json();

            // If response is not OK, log and bail out
        if (!res.ok) {
        console.error("Failed to load all classrooms (status):", res.status, data);
        return;
        }

        //For reasons beyond my understanding this is how the database data is parsed for the frontend - David
        //TODO tweak this to be more universally usable
        setClassrooms(
            data.map(c => ({
                id: c.Id,
                name: c.Title,
                description: c.Description,
                ownerId: c.OwnerId,
                type: "Classroom",  //  ???? - David
            }))
        );
    } catch (err) {
        console.error("Failed to load classrooms:", err);
    }
};

const fetchAllClassrooms = async (setClassrooms) => {
    try {
        const res = await fetch(`api/classrooms/all`);
        const data = await res.json();

        // If the response is not OK, log and stop
        if (!res.ok) {
            console.error('Failed to load all classrooms (status):', res.status, data);
            setClassrooms([]);  // or just return;
            return;
        }

        setClassrooms(
            data.map(c => ({
                id: c.Id,
                name: c.Title,
                description: c.Description,
                ownerId: c.OwnerId,
                type: "Classroom",
            }))
        );
    } catch (err) {
        console.error("Failed to load all classrooms:", err);
    }
};

const addClassroom = async (payload, setClassrooms) => { 
    try {
        const res = await fetch("/api/classrooms/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        
        const data = await res.json();

        if (!res.ok) {
            console.error("Error:", data);
            return;
        }

        setClassrooms(prev => [
            ...prev,
            {
                id: data.Id,
                name: data.Title,
                description: data.Description,
                ownerId: data.OwnerId,
                type: "Classroom",
            }
        ]);

        window.location.href = `/#/classroom/${data.Id}`;
    }
    catch (err) {
        console.error("Request failed", err);
    }
}

const deleteClassroom = async(classroomId, setClassrooms) => {
    try {
        const res = await fetch(`/api/classrooms/delete?classroomId=${classroomId}`, {
            method: "DELETE",
            headers: {"Content-Type" : "application/json"},
        });

        if(!res.ok){
            console.error("Error: ", res.text);
            return;
        }

        //Log a successful delete and remove classroom from React state
        console.log("Classroom successfully deleted.");
        setClassrooms(prev =>
            prev.filter(c => c.id !== classroomId)
        );

        //Reroute to the dashboard page
        //window.location.href = "/#/dashboard";
    }

    catch (err) {
        console.error("Request to delete classroom failed. ", err);
    }
}


const addUser = async(userdata, classroomId) => {
    try{
        const payload = {
            userId : userdata.id,
            classroomId : classroomId
        }

        const res = await fetch("/api/classrooms/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("Error:", data);
            return;
        }
    }

    catch (err) {
        console.error("Request to join failed: ", err);
    }
}

const removeUser = async(userdata, classroomId) => {
    try{
        const payload = {
            userId : userdata.id,
            classroomId : classroomId
        }

        const res = await fetch("/api/classrooms/leave", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("Error:", data);
            return;
        }
    }

    catch (err) {
        console.error("Request to leave failed: ", err);
    }
};

const isMember = async (userdata, classroomId) => {
    try {

        const res = await fetch(`/api/classrooms/isMember?userId=${userdata.id}&classroomId=${classroomId}`, {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        });

        const data = await res.json();
        return data;
    }

    catch (err) {
        console.error("Request to retrieve isMember failed: ", err);
    }
};

const loadContent = async (userdata, classroomId, setContent) => {
    try {
        const quizRes = await fetch(`/api/quizzes?classRoomId=${classroomId}`);
        const quizzes = await quizRes.json();

        const quizItems = quizzes.map(q => ({
            id: q.Id,
            name: q.Title,
            type: "Quiz",
            summary: q.Description || "No description"
        }));

        // FLASHCARDS LADEN
        const fcRes = await fetch(`/api/flashcard/allCards?userId=${userdata.id}`);
        const flashcards = await fcRes.json();

        const flashItems = flashcards
            .filter(fc => fc.ClassRoomId === classroomId) // Nur Flashcards für dieses Classroom
            .map(fc => ({
                id: fc.Id,
                name: fc.Title,
                type: "Flashcard",
                summary: fc.Information || "Flashcard set"
            }));

        setContent([...quizItems, ...flashItems]);


    } catch (err) {
        console.error("Error loading quizzes:", err);
    }
};

const updateClassroomScore = async(userdata, classroomId, dexp) => {
    try{
        const result = await fetch(`/api/classrooms/updateScore?userId=${userdata.id}&classroomId=${classroomId}&dexp=${dexp}`);
        const data = await result.json();
        if (!result.ok) {
            console.error("Error:", data);
            return;
        }
    } catch(error){
        console.error("Request to update classroom score failed: ", error);
    }
}

const classroomLevel = async(userId, classroomId) => {
    try{
        const result = await fetch(`/api/classrooms/userlevel?userId=${userId}&classroomId=${classroomId}`);
        const data = await result.json();
        if (!result.ok) {
            console.error("Error:", data);
            return;
        }
        return data;
    } catch(error){
        console.error("Request to update classroom score failed: ", error);
    }
}

const leaderboard = async(classroomId) => {
    try{
        const result = await fetch(`/api/classrooms/leaderboard?classroomId=${classroomId}`);
        const leaders = await result.json();

        return leaders.leaderboard;

    } catch (err) {
        console.error("Error loading leaderboard: ", err);
    }
};  

const classroomController = {fetchClassrooms, fetchAllClassrooms, addClassroom, deleteClassroom, addUser, removeUser, isMember, loadContent, leaderboard, updateClassroomScore, classroomLevel};
export default classroomController;