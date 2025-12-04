const fetchClassrooms = async (userdata, setClassrooms) => {
        try {
            const res = await fetch(`api/classrooms?userId=${userdata.id}`);
            const data = await res.json();

            //For reasons beyond my understanding this is how the database data is parsed for the frontend - David
            //TODO tweak this to be more universally usable
            setClassrooms(
                data.map(c => ({
                    id: c.ID,
                    name: c.Title,
                    description: c.Description,
                    type: "Classroom",  //  ???? - David
                }))
            );
        } catch (err) {
            console.error("Failed to load classrooms:", err);
        }
    };

    const addClassroom = async (payload, setClassrooms) => { 
        try {
            const res = await fetch("/api/classrooms", {
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
                    id: data.ID,
                    name: data.Title,
                    description: data.Description,
                    type: "Classroom",
                }
            ]);

        }
        catch (err) {
            console.error("Request failed", err);
        }
    }

const classroomController = {fetchClassrooms, addClassroom};
export default classroomController;