document.addEventListener("DOMContentLoaded", function() {
    const matches = [
        { id: 1, team1: "PSG", team2: "OM", score1: 0, score2: 0, date: "2025-03-21", time: "18:00", startTime: null, finished: false, status: "upcoming", penalties: null },
        { id: 2, team1: "Real Madrid", team2: "Barcelone", score1: 0, score2: 0, date: "2025-03-21", time: "18:00", startTime: null, finished: false, status: "upcoming", penalties: null }
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
                <p id="timer-${match.id}" class="timer"></p>
                <div id="penalties-${match.id}" class="penalties"></div>
            `;
            matchScores.appendChild(matchCard);
        });
    }

    function simulateMatch() {
        matches.forEach(match => {
            if (match.status === "live" && !match.finished) {
                if (Math.random() < 0.05) { // 5% de chance toutes les 30 sec (ajusté pour réalisme)
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
            const matchDateTime = new Date(`${match.date}T${match.time}`);

            if (currentDateTime >= matchDateTime && !match.finished) {
                if (!match.startTime) match.startTime = matchDateTime;
                const elapsedTime = (currentDateTime - match.startTime) / 1000;

                if (elapsedTime < 90 * 60) {
                    match.status = "live";
                    matchStatus.classList.replace("upcoming", "live");
                    matchStatus.innerText = "Status: Live";
                } else {
                    match.finished = true;
                    match.status = "finished";
                    matchStatus.classList.replace("live", "finished");
                    matchStatus.innerText = "Status: Finished";

                    if (match.score1 === match.score2) {
                        startPenalties(match);
                    }
                }
            }
        });
    }

    function startPenalties(match) {
        console.log(`Tirs au but pour ${match.team1} vs ${match.team2}`);
        const penaltiesDiv = document.getElementById(`penalties-${match.id}`);
        penaltiesDiv.innerHTML = "<h3>Tirs au but</h3>";

        let team1Score = 0;
        let team2Score = 0;
        let rounds = 5;

        for (let i = 0; i < rounds; i++) {
            team1Score += shootPenalty(penaltiesDiv, match.team1);
            team2Score += shootPenalty(penaltiesDiv, match.team2);
        }

        while (team1Score === team2Score) { // Mort subite
            team1Score += shootPenalty(penaltiesDiv, match.team1);
            team2Score += shootPenalty(penaltiesDiv, match.team2);
        }

        penaltiesDiv.innerHTML += `<p><strong>Victoire de ${team1Score > team2Score ? match.team1 : match.team2} !</strong></p>`;
    }

    function shootPenalty(container, teamName) {
        const penalty = document.createElement("div");
        penalty.classList.add("penalty");

        if (Math.random() < 0.5) { // 50% de chance de marquer
            penalty.classList.add("goal");
            container.innerHTML += `<p>${teamName} : ✅</p>`;
            container.appendChild(penalty);
            return 1;
        } else {
            penalty.classList.add("miss");
            container.innerHTML += `<p>${teamName} : ❌</p>`;
            container.appendChild(penalty);
            return 0;
        }
    }

    displayMatches();
    setInterval(updateMatchStatus, 1000);
    setInterval(simulateMatch, 30000);
});
