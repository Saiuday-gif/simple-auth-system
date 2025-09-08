const express = require('express');
const app = express();
const path = require('path');

// Middleware to parse incoming form data from the client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
// This is where your login.html, CSS, and client-side JS files should be
app.use(express.static('public'));

// GET Route to serve the login page
// This route responds to browser requests to display the login form.
app.get('/auth/login', (req, res) => {
    // The res.sendFile() method sends the login.html file to the browser
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST Route to handle login form submission
// This route processes the data sent from the login form.
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    // TODO: Implement your authentication logic here
    // Example: Check if the username and password match a record in your database.

    if (username === 'testuser' && password === 'password123') {
        console.log(User `${username}' logged in successfully.`);
        // Redirect the user to a success page or dashboard
        res.send('Login successful! Welcome.');
    } else {
        console.log('Login failed: Invalid credentials.');
        // Send an error message or redirect back to the login page with an error
        res.send('Login failed. Please check your username and password.');
    }
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running at http://localhost:5000/auth/login');
    console.log('Login page is at http://localhost:5000/auth/login');
});
