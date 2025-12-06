const updateUsername = async (userdata, newUsername) => {
    try {
        const payload = {
            userId : userdata.id,
            newUsername : newUsername
        }

        const res = await fetch(`/api/user/update-username`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if(!res.ok){
            console.error("Error updating username: ", res.text);
            return;
        }

        console.log("Username successfully updated");
    }

    catch (err) {
        console.error("Error in update username: ", err);
    }
} 

const dashboardController = {
    updateUsername,

};
export default dashboardController;