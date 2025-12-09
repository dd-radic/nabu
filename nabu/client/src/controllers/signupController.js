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

        //Return the credentials to the caller so they can be used for login
        const payload = {
            username : result.username,
            password : result.password
        }
        return payload;

    } catch (err) {
        console.error('Signup failed:', err);
        return null;
    }
};

const signupController = {signupAction};
export default signupController;