document.addEventListener("DOMContentLoaded", function() {
    const matches = [
        { id: 1, team1: "PSG", team2: "OM", score1: 0, score2: 0, date: "2025-03-21", time: "20:45", startTime: null, finished: false, status: "upcoming", penalties: null },
        { id: 2, team1: "Real Madrid", team2: "Barcelone", score1: 0, score2: 0, date: "2025-03-21", time: "21:00", startTime: null, finished: false, status: "upcoming", penalties: null }
    ];

    const matchScores = document.getElementById("match-scores");

    function displayMatches() {
        matchScores.innerHTML = "";
        matches.forEach(match => {
            const matchCard = document.createElement("div");
            matchCard.classList.add("match-card");
            matchCard.innerHTML = `
                <h2>${match.team1} vs ${match.team2}</h2>
                <p class="score" id="score-${match.id}">${match.score1} - ${match.score2}</p>
                <p id="status-${match.id}" class="status upcoming">Status: ${match.status}</p>
                <p id="timer-${match.id}" class="timer">00:00</p>
                <div id="penalties-${match.id}" class="penalties"></div>
            `;
            matchScores.appendChild(matchCard);
        });
    }

    function simulateMatch() {
        matches.forEach(match => {
            if (match.status === "live" && !match.finished) {
                if (Math.random() < 0.01) { // 1% de chance de but toutes les 30 sec
                    let scoringTeam = Math.random() < 0.5 ? "score1" : "score2";
                    match[scoringTeam]++;
                    document.getElementById(`score-${match.id}`).innerText = `${match.score1} - ${match.score2}`;
                }
            }
        });
    }

    function updateMatchStatus() {
        const currentDateTime = new Date();
        matches.forEach(match => {
            const matchStatus = document.getElementById(`status-${match.id}`);
            const matchTimer = document.getElementById(`timer-${match.id}`);
            const matchDateTime = new Date(`${match.date}T${match.time}`);

            if (currentDateTime >= matchDateTime && !match.finished) {
                if (!match.startTime) match.startTime = matchDateTime;
                let elapsedTime = (currentDateTime - match.startTime) / 1000;

                if (elapsedTime < 45 * 60) {
                    match.status = "live";
                    matchStatus.classList.replace("upcoming", "live");
                    matchStatus.innerText = "Status: Live";
                    matchTimer.innerText = formatTime(elapsedTime);
                } else if (elapsedTime >= 45 * 60 && elapsedTime < 60 * 60) {
                    match.status = "half-time";
                    matchStatus.classList.replace("live", "half-time");
                    matchStatus.innerText = "Status: Half-Time";
                    matchTimer.innerText = "45:00 (Pause)";
                } else if (elapsedTime >= 60 * 60 && elapsedTime < 90 * 60) {
                    match.status = "live";
                    matchStatus.classList.replace("half-time", "live");
                    matchStatus.innerText = "Status: Live";
                    matchTimer.innerText = formatTime(elapsedTime - 15 * 60);
                } else {
                    match.finished = true;
                    match.status = "finished";
                    matchStatus.classList.replace("live", "finished");
                    matchStatus.innerText = "Status: Finished";
                    matchTimer.innerText = "90:00";

                    if (match.score1 === match.score2) {
                        startPenalties(match);
                    }
                }
            }
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
