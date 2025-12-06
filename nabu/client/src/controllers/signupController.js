const signupAction = async (req) => {
    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });

        if (!res.ok) {
            console.error(`Error signing up: ${res.status}`);
            // TODO: Show an error message to the user (e.g., "Username taken")
            return;
        }

        const result = await res.json();
        console.log('Signup successful:', result);

        //Call login to log in the newly created user
        const payload = {
            username : result.username,
            password : result.password
        }

        const newres = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        //loginAction(payload, setUserdata, setToken);

    } catch (err) {
        console.error('Signup failed:', err);
        // TODO: Show a network error to the user
    }
};

const signupController = {signupAction};
export default signupController;