document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/user-accounts/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                if (data.role === 'ADMIN') {
                    document.getElementById('result').innerHTML = 'Welcome Admin!';
                    // Additional Admin functionality can be added here
                } else if (data.role === 'USER') {
                    document.getElementById('result').innerHTML = 'Welcome User!';
                    // Additional User functionality can be added here
                }
            } else {
                document.getElementById('result').innerHTML = 'Login failed: ' + data.message;
            }
        })
        .catch(error => console.error('Error:', error));
});
