document.addEventListener("DOMContentLoaded", function() {
    const matches = [
        { id: 1, team1: "Fc Ethan", team2: "Fc Lewis", score1: 1, score2: 2, date: "2025-03-21", time: "13:35", startTime: null, finished: false, status: "upcoming" },
        { id: 2, team1: "Fc Ethan", team2: "Fc Rayan", score1: 1, score2: 4, date: "2025-03-21", time: "12:55", startTime: null, finished: false, status: "upcoming" },
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
