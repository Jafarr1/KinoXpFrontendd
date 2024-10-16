// Get form elements
const addReservationButton = document.getElementById('create-reservation-btn');

// Function to create a reservation
addReservationButton.addEventListener('click', () => {
    const customerId = document.getElementById('customer-id').value;
    const screeningId = document.getElementById('screening-id').value;

    // Basic validation
    if (!customerId || !screeningId) {
        alert('Please fill in both Customer ID and Screening ID.');
        return;
    }

    // Create reservation object
    const newReservation = {
        customer: { customerId: customerId },
        screening: { screeningId: screeningId }
    };

    // Send POST request to backend
    fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReservation)
    })
        .then(response => {
            if (response.ok) {
                alert('Reservation created successfully!');
                // Optionally fetch and display the updated reservation list
                fetchReservations();
            } else {
                alert('Failed to create reservation.');
            }
        })
        .catch(error => console.error('Error creating reservation:', error));
});

// Optional: Function to fetch all reservations
function fetchReservations() {
    fetch('http://localhost:8080/api/reservations')
        .then(response => response.json())
        .then(data => {
            renderReservations(data);
        })
        .catch(error => console.error('Error fetching reservations:', error));
}

// Optional: Function to render reservations on the page
function renderReservations(reservations) {
    const reservationList = document.getElementById('reservation-list');
    reservationList.innerHTML = ''; // Clear previous reservations

    if (reservations.length === 0) {
        reservationList.innerHTML = '<p>No reservations available.</p>';
        return;
    }

    reservations.forEach(reservation => {
        const card = document.createElement('div');
        card.className = 'reservation-card';

        card.innerHTML = `
            <h3>Reservation ID: ${reservation.reservationId}</h3>
            <p><strong>Customer ID:</strong> ${reservation.customer.customerId}</p>
            <p><strong>Screening ID:</strong> ${reservation.screening.screeningId}</p>
        `;

        reservationList.appendChild(card);
    });
}

fetchReservations();
