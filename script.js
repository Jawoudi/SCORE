document.addEventListener("DOMContentLoaded", function() {
    const matches = [
        { id: 1, team1: "Paris Saint-Germain", team2: "Olympique de Marseille", score1: 0, score2: 0, date: "2025-03-16", time: "20:45", startTime: null, finished: false, status: "upcoming" },
        { id: 2, team1: "Atlético Madrid", team2: "FC Barcelone", score1: 0, score2: 0, date: "2025-03-16", time: "21:00", startTime: null, finished: false, status: "upcoming" },
        { id: 3, team1: "Sevilla FC", team2: "Athletic Bilbao", score1: 0, score2: 0, date: "2025-03-16", time: "16:15", startTime: null, finished: false, status: "upcoming" },
        { id: 4, team1: "Leicester City", team2: "Manchester United", score1: 0, score2: 0, date: "2025-03-16", time: "20:00", startTime: null, finished: false, status: "upcoming" },
        { id: 5, team1: "Montpellier", team2: "Saint-Étienne", score1: 0, score2: 0, date: "2025-03-16", time: "13:30", startTime: null, finished: false, status: "upcoming" },
        { id: 6, team1: "Fulham", team2: "Tottenham Hotspur", score1: 0, score2: 0, date: "2025-03-16", time: "14:30", startTime: null, finished: false, status: "upcoming" },
        { id: 7, team1: "Arsenal", team2: "Chelsea", score1: 0, score2: 0, date: "2025-03-16", time: "14:30", startTime: null, finished: false, status: "upcoming" },
        { id: 8, team1: "Lyon", team2: "Le Havre", score1: 0, score2: 0, date: "2025-03-16", time: "15:00", startTime: null, finished: false, status: "upcoming" },
        { id: 9, team1: "Strasbourg", team2: "Toulouse", score1: 0, score2: 0, date: "2025-03-16", time: "17:15", startTime: null, finished: false, status: "upcoming" },
        { id: 10, team1: "Brest", team2: "Reims", score1: 0, score2: 0, date: "2025-03-16", time: "17:15", startTime: null, finished: false, status: "upcoming" }
        { id: 11, team1: "MetroStars", team2: "Raiders", score1: 0, score2: 0, date: "2025-03-16", time: "10:10", startTime: null, finished: false, status: "upcoming" }
    ];

    ];

    const matchScores = document.getElementById("match-scores");

    function displayMatches() {
        matchScores.innerHTML = "";
        matches.forEach(function(match) {
            const matchCard = document.createElement("div");
            matchCard.classList.add("match-card");
            matchCard.innerHTML = `
                <h2>Match à venir</h2>
                <p class="team">${match.team1} vs ${match.team2}</p>
                <p class="score" id="score-${match.id}">${match.score1} - ${match.score2}</p>
                <p>Date et heure: ${match.date} ${match.time}</p>
                <p id="status-${match.id}" class="status upcoming">Status: ${match.status}</p>
                <p id="timer-${match.id}" class="timer"></p>
            `;
            matchScores.appendChild(matchCard);
        });
    }

    function updateMatchStatus() {
        const currentDateTime = new Date();
        matches.forEach(function(match) {
            const matchStatus = document.getElementById(`status-${match.id}`);
            const timer = document.getElementById(`timer-${match.id}`);
            const matchDateTime = new Date(`${match.date}T${match.time}`);

            if (currentDateTime >= matchDateTime && !match.finished) {
                if (!match.startTime) match.startTime = matchDateTime;
                const elapsedTime = currentDateTime - match.startTime;

                if (elapsedTime < 90 * 60 * 1000) {
                    match.status = "live";
                    matchStatus.classList.replace('upcoming', 'live');
                    matchStatus.innerText = "Status: live";
                    timer.innerText = formatTime(elapsedTime);
                } else {
                    match.finished = true;
                    match.status = "finished";
                    matchStatus.classList.replace('live', 'finished');
                    matchStatus.innerText = "Status: finished";
                    timer.innerText = "";
                }
            }
        });

        const allFinished = matches.every(match => match.finished);
        if (allFinished) clearInterval(intervalId);
    }

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    displayMatches();
    const intervalId = setInterval(updateMatchStatus, 1000);

    const bestPlayersContainer = document.getElementById("best-players-container");
    const playerInput = document.getElementById("player-input");
    const addPlayerBtn = document.getElementById("add-player-btn");

    function addPlayer(playerName, playerImage) {
        const playerCard = document.createElement("div");
        playerCard.classList.add("player-card");
        playerCard.innerHTML = `
            <img src="${playerImage}" alt="${playerName}">
            <p>${playerName}</p>
        `;
        bestPlayersContainer.appendChild(playerCard);
    }

    addPlayerBtn.addEventListener("click", function() {
        const playerName = playerInput.value.trim();
        if (playerName) {
            const playerImage = prompt("Entrez l'URL de l'image du joueur:");
            if (playerImage) addPlayer(playerName, playerImage);
            playerInput.value = "";
        }
    });
});
