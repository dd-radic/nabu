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

    }
    catch (err) {
        console.error("Request failed", err);
    }
}

const deleteClassroom = async(classroomId) => {
    try {
        const res = await fetch(`/api/classrooms/delete?classroomId=${classroomId}`, {
            method: "DELETE",
            headers: {"Content-Type" : "application/json"},
        });

        if(!res.ok){
            console.error("Error: ", res.text);
            return;
        }

        console.log("Classroom successfully deleted.");
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

const classroomController = {
    fetchClassrooms, 
    fetchAllClassrooms, 
    addClassroom, 
    addUser, 
    removeUser, 
    isMember, 
    deleteClassroom
};
export default classroomController;