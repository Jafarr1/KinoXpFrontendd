const cinemaList = document.getElementById('cinema-list');
const addCinemaButton = document.getElementById('add-cinema-btn');

// Function to fetch all cinemas
function fetchCinemas() {
    fetch('http://localhost:8080/api/cinemas')
        .then(response => response.json())
        .then(data => {
            renderCinemas(data);
        })
        .catch(error => console.error('Error fetching cinemas:', error));
}

// Function to render cinemas
function renderCinemas(cinemas) {
    cinemaList.innerHTML = ''; // Clear previous cinemas

    if (cinemas.length === 0) {
        cinemaList.innerHTML = '<p>No cinemas available.</p>';
        return;
    }

    cinemas.forEach(cinema => {
        const card = document.createElement('div');
        card.className = 'cinema-card';

        let theatersHtml = '';
        if (cinema.theaters && cinema.theaters.length > 0) {
            theatersHtml = '<ul>' + cinema.theaters.map(theater => `<li>Theater ID: ${theater.theaterId}</li>`).join('') + '</ul>';
        } else {
            theatersHtml = '<p>No theaters available for this cinema.</p>';
        }

        card.innerHTML = `
            <h3>${cinema.name}</h3>
            <p><strong>Location:</strong> ${cinema.location}</p>
            <h4>Theaters</h4>
            ${theatersHtml}
            <button onclick="deleteCinema(${cinema.cinemaId})">Delete</button>
        `;

        cinemaList.appendChild(card);
    });
}

// Function to add a cinema
addCinemaButton.addEventListener('click', () => {
    const name = document.getElementById('cinema-name').value;
    const location = document.getElementById('cinema-location').value;

    if (!name || !location) {
        alert('Please fill in both fields.');
        return;
    }

    const newCinema = {
        name: name,
        location: location
    };

    fetch('http://localhost:8080/api/cinemas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCinema)
    })
        .then(response => {
            if (response.ok) {
                alert('Cinema added successfully!');
                fetchCinemas(); // Refresh the cinema list
            } else {
                alert('Failed to add cinema.');
            }
        })
        .catch(error => console.error('Error adding cinema:', error));
});

// Function to delete a cinema
function deleteCinema(cinemaId) {
    if (confirm('Are you sure you want to delete this cinema?')) {
        fetch(`http://localhost:8080/api/cinemas/${cinemaId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Cinema deleted successfully!');
                    fetchCinemas(); // Refresh the cinema list
                } else {
                    alert('Failed to delete cinema.');
                }
            })
            .catch(error => console.error('Error deleting cinema:', error));
    }
}

// Initial fetch of cinemas when the page loads
fetchCinemas();
