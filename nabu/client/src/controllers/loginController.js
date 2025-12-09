const loginAction = async (req, setUserdata, setToken) => {
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        });

        if (!res.ok) {
            alert("Server Error");
            console.error(`Error logging in: ${res.status}`);
            return; 
        }

        const data = await res.json();

        if (data){
            setUserdata(data)
            setToken(data.token)
            localStorage.setItem("site", data.token);

            window.location.href = "/#/dashboard"
            return;
        }
        throw new Error(data.message);
    } 
    catch (err) {
        console.error(err);
    }
};

const logOut = (setUserdata, setToken) => {
    //Clear out React state
    setUserdata(null);
    setToken("");

    //Clear out local storage
    localStorage.removeItem("site");

    //Navigate back to welcome page
    window.location.href = "/#/"
};

const loginController = {loginAction, logOut}
export default loginController;