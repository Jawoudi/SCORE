document.addEventListener("DOMContentLoaded", function() {
    const matches = [
        { id: 1, team1: "jasmine", team2: "Olympique de Marseille", score1: 10000000000000000, score2: 0, date: "2025-03-16", time: "11:00", startTime: null, finished: false, status: "upcoming" },
        { id: 2, team1: "Atlético Madrid", team2: "FC Barcelone", score1: 0, score2: 0, date: "2025-03-16", time: "21:00", startTime: null, finished: false, status: "upcoming" },
        { id: 3, team1: "Sevilla FC", team2: "Athletic Bilbao", score1: 0, score2: 0, date: "2025-03-16", time: "16:15", startTime: null, finished: false, status: "upcoming" },
        { id: 4, team1: "Leicester City", team2: "Manchester United", score1: 0, score2: 0, date: "2025-03-16", time: "20:00", startTime: null, finished: false, status: "upcoming" },
        { id: 5, team1: "Montpellier", team2: "Saint-Étienne", score1: 0, score2: 0, date: "2025-03-16", time: "13:30", startTime: null, finished: false, status: "upcoming" },
        { id: 6, team1: "Fulham", team2: "Tottenham Hotspur", score1: 0, score2: 0, date: "2025-03-16", time: "14:30", startTime: null, finished: false, status: "upcoming" },
        { id: 7, team1: "Arsenal", team2: "Chelsea", score1: 0, score2: 0, date: "2025-03-16", time: "14:30", startTime: null, finished: false, status: "upcoming" },
        { id: 8, team1: "Lyon", team2: "Le Havre", score1: 0, score2: 0, date: "2025-03-16", time: "15:00", startTime: null, finished: false, status: "upcoming" },
        { id: 9, team1: "Strasbourg", team2: "Toulouse", score1: 0, score2: 0, date: "2025-03-16", time: "17:15", startTime: null, finished: false, status: "upcoming" },
        { id: 10, team1: "Brest", team2: "Reims", score1: 0, score2: 0, date: "2025-03-16", time: "17:15", startTime: null, finished: false, status: "upcoming" }
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
                const elapsedTime = Math.floor((currentDateTime - match.startTime) / 1000); // en secondes

                if (elapsedTime < 45 * 60) {
                    // Première mi-temps
                    match.status = "live";
                    matchStatus.classList.replace('upcoming', 'live');
                    matchStatus.innerText = "Status: Live";
                    timer.innerText = formatTime(elapsedTime);
                } else if (elapsedTime >= 45 * 60 && elapsedTime < 60 * 60) {
                    // Mi-temps (15 minutes)
                    match.status = "half-time";
                    matchStatus.classList.replace('live', 'half-time');
                    matchStatus.innerText = "Status: Half-Time";
                    timer.innerText = "15:00 (Pause)";
                } else if (elapsedTime >= 60 * 60 && elapsedTime < 90 * 60) {
                    // Deuxième mi-temps
                    match.status = "live";
                    matchStatus.classList.replace('half-time', 'live');
                    matchStatus.innerText = "Status: Live";
                    timer.innerText = formatTime(elapsedTime - 15 * 60); // Reprend après la pause
                } else {
                    // Match terminé
                    match.finished = true;
                    match.status = "finished";
                    matchStatus.classList.replace('live', 'finished');
                    matchStatus.innerText = "Status: Finished";
                    timer.innerText = "";
                }
            }
        });

        const allFinished = matches.every(match => match.finished);
        if (allFinished) clearInterval(intervalId);
    }

    // Formater le temps en mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    displayMatches(); // Affiche les matchs au chargement de la page
    const intervalId = setInterval(updateMatchStatus, 1000);
}); // ✅ Ajouté la fermeture correcte de la fonction
