document.addEventListener('DOMContentLoaded', function() {
    const addScreeningButton = document.getElementById("addScreeningButton");
    const inpMovieTitle = document.getElementById("movieTitle");
    const inpDateTime = document.getElementById("dateTime");
    const inpTheaterId = document.getElementById("theaterId");
    const inpAgeLimit = document.getElementById("ageLimit");
    const screeningList = document.getElementById("screeningList");
    const ScreeningUrl = "http://localhost:8080/api/screenings";

    fetchScreenings(); // Initial fetch

    async function fetchScreenings() {
        document.getElementById('response').innerHTML = showLoading('Loading screenings, please wait...');
        try {
            const res = await fetch(ScreeningUrl);
            if (res.ok) {
                const screenings = await res.json();
                displayScreenings(screenings);
            } else {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Failed to fetch screenings:", error);
            document.getElementById('response').innerText = 'Failed to fetch screenings: ' + error.message;
        }
    }

    async function postScreening() {
        const screening = {
            movieTitle: inpMovieTitle.value,
            dateTime: inpDateTime.value,
            theaterId: inpTheaterId.value,
            ageLimit: inpAgeLimit.value
        };

        console.log("Posting screening:", screening); // Log the screening data


        document.getElementById('response').innerHTML = showLoading('Saving screening, please wait...');
        try {
            const res = await postObjectAsJson(ScreeningUrl, screening, "POST");
            if (res.ok) {
                alert("Screening saved");
                resetForm(); // Reset after saving
                await fetchScreenings(); // Refresh the list
            } else {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Error saving screening: ' + error.message;
        }
    }

    function displayScreenings(screenings) {
        screeningList.innerHTML = ""; // Clear the list first
        screenings.forEach(screening => {
            const li = document.createElement("li");
            li.textContent = `${screening.movieTitle} - ${new Date(screening.dateTime).toLocaleString()} - Theater ID: ${screening.theaterId} - Age Limit: ${screening.ageLimit}`;
            screeningList.appendChild(li);
        });
    }

    async function postObjectAsJson(url, object, httpVerb) {
        const objectAsJsonString = JSON.stringify(object);
        const fetchOptions = {
            method: httpVerb,
            headers: {
                "Content-Type": "application/json",
            },
            body: objectAsJsonString
        };
        const response = await fetch(url, fetchOptions);
        return response;
    }

    function showLoading(message) {
        return `
            <div class="mx-auto p-3 d-flex align-items-center">
                <p class="mb-0" style="display: inline-block;">${message}</p>
                <div class="spinner-grow text-secondary ml-2" role="status" style="width: 1.5rem; height: 1.5rem;">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `;
    }

    function resetForm() {
        inpMovieTitle.value = '';
        inpDateTime.value = '';
        inpTheaterId.value = '';
        inpAgeLimit.value = '';
        document.getElementById('response').innerHTML = 'Form has been reset.';
    }

    // Event Listener for the button
    addScreeningButton.addEventListener('click', function() {
        postScreening();
    });
});
