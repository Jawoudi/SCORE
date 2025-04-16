const apiKey = '61ce32fba04dfd031856e6bcef548b59';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseApi = 'https://v3.football.api-sports.io/';

let previousScores = {};

async function getLiveScores() {
  try {
    const response = await fetch(proxyUrl + baseApi + 'fixtures?live=all', {
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
      data.response.forEach(async match => {
        const matchId = match.fixture.id;
        const home = match.teams.home.name;
        const away = match.teams.away.name;
        const scoreHome = match.goals.home ?? 0;
        const scoreAway = match.goals.away ?? 0;
        const minute = match.fixture.status.elapsed ?? '–';

        // Carte du match
        const card = document.createElement("div");
        card.className = "match-card";

        const title = document.createElement("div");
        title.innerHTML = `<strong>${home}</strong> vs <strong>${away}</strong>`;

        const time = document.createElement("div");
        time.style.fontSize = "0.9em";
        time.style.marginBottom = "8px";
        time.textContent = `🕐 ${minute}'`;

        const score = document.createElement("div");
        score.className = "score";
        score.textContent = `${scoreHome} - ${scoreAway}`;

        // Animation si but marqué
        const prev = previousScores[matchId];
        if (prev && (prev.home !== scoreHome || prev.away !== scoreAway)) {
          score.classList.add("highlight");
        }

        // Zone des buteurs
        const scorers = document.createElement("div");
        scorers.style.marginTop = "10px";
        scorers.style.fontSize = "0.85em";

        // On récupère les événements du match
        const eventsRes = await fetch(proxyUrl + baseApi + `fixtures/events?fixture=${matchId}`, {
          method: 'GET',
          headers: {
            'x-apisports-key': apiKey
          }
        });

        const eventsData = await eventsRes.json();

        // Filtrer que les buts (Goal)
        const goalEvents = eventsData.response.filter(ev => ev.type === "Goal");

        if (goalEvents.length > 0) {
          const list = goalEvents.map(ev =>
            `${ev.player.name} (${ev.time.elapsed}')`
          );
          scorers.innerHTML = `⚽ Buteurs :<br>${list.join("<br>")}`;
        }

        card.appendChild(title);
        card.appendChild(time);
        card.appendChild(score);
        card.appendChild(scorers);
        scoresDiv.appendChild(card);

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
