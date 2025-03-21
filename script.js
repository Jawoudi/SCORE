document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    const welcomeScreen = document.getElementById("welcome-screen");
    const mainHeader = document.getElementById("main-header");
    const mainContent = document.getElementById("main-content");
    const usernameDisplay = document.getElementById("username-display");

    if (username) {
        welcomeScreen.classList.add("hidden");
        mainHeader.classList.remove("hidden");
        mainContent.classList.remove("hidden");
        usernameDisplay.textContent = username;
    }

    const matches = [
        { team1: "PSG", team2: "OM", date: "2025-03-25" },
        { team1: "Real Madrid", team2: "Barcelone", date: "2025-03-26" },
        { team1: "Manchester City", team2: "Liverpool", date: "2025-03-27" },
    ];

    const matchesContainer = document.getElementById("matches");

    matches.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.classList.add("match-card");
        matchCard.innerHTML = `
            <h3>${match.team1} vs ${match.team2}</h3>
            <p>Date : ${match.date}</p>
            <button onclick="predict('${match.team1}', '${match.team2}')">Pronostiquer</button>
        `;
        matchesContainer.appendChild(matchCard);
    });
});

function saveUsername() {
    const usernameInput = document.getElementById("username-input").value;
    if (usernameInput) {
        localStorage.setItem("username", usernameInput);
        location.reload();
    } else {
        alert("Veuillez entrer un pseudo !");
    }
}

function predict(team1, team2) {
    alert(`Pronostiquez sur le match ${team1} vs ${team2} !`);
}
