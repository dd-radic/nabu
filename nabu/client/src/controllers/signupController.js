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

    // TODO: Show a success message to the user
    // Redirect them to the login page
    window.location.href = '#/login';

    } catch (err) {
        console.error('Signup failed:', err);
        // TODO: Show a network error to the user
    }
};

const signupController = {signupAction};
export default signupController;