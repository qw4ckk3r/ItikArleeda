function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; 

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Update the clock display
    document.getElementById('clock').textContent = `${hours}:${minutes} ${amPm}`;
}

// Update clock every minute
setInterval(updateClock, 60000);
updateClock(); // Call function immediately to avoid delay


//stop
//stop
//quotes js
function fetchQuote() {
    fetch("quotes.json") // Fetch from our local file
        .then(response => response.json())
        .then(data => {
            let randomIndex = Math.floor(Math.random() * data.length);
            let quote = data[randomIndex];
            document.getElementById("quote").innerText = `"${quote.quote}"`;
        })
        .catch(error => {
            console.error("Error fetching quote:", error);
            document.getElementById("quote").innerText = "Oops! Couldn't load a cute quote.";
        });
}

// Fetch a quote when the page loads
fetchQuote();

// Fetch a new quote when button is clicked
document.getElementById("new-quote").addEventListener("click", fetchQuote);


// Ensure DOM is loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
    let button = document.getElementById("popup-button");
    let popup = document.getElementById("popup");
    let popupContent = document.querySelector(".popup-content");

    // Attach event listener to button
    if (button) {
        button.addEventListener("click", openPopup);
    }

    // Attach event listeners for closing popup when clicking outside (for both mobile & desktop)
    ["click", "touchstart"].forEach(eventType => {
        window.addEventListener(eventType, function (event) {
            // If the popup is open and the user clicks outside, close it
            if (popup && popupContent && event.target === popup) {
                closePopup();
            }
        });
    });
});

// Open Popup
function openPopup() {
    let popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "flex";
    }
}

// Close Popup
function closePopup() {
    let popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
    }
}

