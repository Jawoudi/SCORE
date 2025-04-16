const apiKey = '61ce32fba04dfd031856e6bcef548b59';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://v3.football.api-sports.io/fixtures?live=all';

// Sauvegarde des scores précédents pour détecter les buts
let previousScores = {};

async function getLiveScores() {
  try {
    const response = await fetch(proxyUrl + apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    const scoresDiv = document.getElementById('scores');
    scoresDiv.innerHTML = "";

    if (data.response.length === 0) {
      scoresDiv.innerHTML = "<p>Aucun match en direct actuellement.</p>";
    } else {
      data.response.forEach(match => {
        const matchId = match.fixture.id;
        const home = match.teams.home.name;
        const away = match.teams.away.name;
        const scoreHome = match.goals.home ?? 0;
        const scoreAway = match.goals.away ?? 0;

        const card = document.createElement("div");
        card.className = "match-card";

        const title = document.createElement("div");
        title.className = "teams";
        title.innerHTML = `<strong>${home}</strong> vs <strong>${away}</strong>`;

        const score = document.createElement("div");
        score.className = "score";
        score.textContent = `${scoreHome} - ${scoreAway}`;

        // Détection de changement de score
        const prev = previousScores[matchId];
        if (prev && (prev.home !== scoreHome || prev.away !== scoreAway)) {
          score.classList.add("highlight");
        }

        card.appendChild(title);
        card.appendChild(score);
        scoresDiv.appendChild(card);

        // Met à jour les scores précédents
        previousScores[matchId] = { home: scoreHome, away: scoreAway };
      });
    }

  } catch (error) {
    console.error("Erreur :", error);
    document.getElementById('scores').innerHTML = `<p>Erreur : ${error.message}</p>`;
  }
}

getLiveScores();
setInterval(getLiveScores, 65000);

