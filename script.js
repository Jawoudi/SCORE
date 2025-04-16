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
      for (const match of data.response) {
        const matchId = match.fixture.id;
        const home = match.teams.home.name;
        const away = match.teams.away.name;
        const homeLogo = match.teams.home.logo;
        const awayLogo = match.teams.away.logo;
        const scoreHome = match.goals.home ?? 0;
        const scoreAway = match.goals.away ?? 0;
        const minute = match.fixture.status.elapsed ?? '–';

        // Carte du match
        const card = document.createElement("div");
        card.className = "match-card";

        const title = document.createElement("div");
        title.className = "teams-row";
        title.innerHTML = `
          <div class="team">
            <img src="${homeLogo}" alt="${home}" />
            <span>${home}</span>
          </div>
          <strong>${scoreHome} - ${scoreAway}</strong>
          <div class="team">
            <img src="${awayLogo}" alt="${away}" />
            <span>${away}</span>
          </div>
        `;

        const time = document.createElement("div");
        time.className = "match-minute";
        time.textContent = `🕐 ${minute}'`;

        const score = document.createElement("div");
        score.className = "score";

        // Détection de but
        const prev = previousScores[matchId];
        if (prev && (prev.home !== scoreHome || prev.away !== scoreAway)) {
          score.classList.add("highlight");
        }

        // Zone des buteurs
        const scorers = document.createElement("div");
        scorers.className = "scorers";

        const eventsRes = await fetch(proxyUrl + baseApi + `fixtures/events?fixture=${matchId}`, {
          method: 'GET',
          headers: {
            'x-apisports-key': apiKey
          }
        });

        const eventsData = await eventsRes.json();
        const goalEvents = eventsData.response.filter(ev => ev.type === "Goal");

        const homeGoals = goalEvents.filter(ev => ev.team.name === home);
        const awayGoals = goalEvents.filter(ev => ev.team.name === away);

        if (goalEvents.length > 0) {
          const homeList = homeGoals.map(ev => `⚽ ${ev.player.name} (${ev.time.elapsed}')`).join('<br>');
          const awayList = awayGoals.map(ev => `⚽ ${ev.player.name} (${ev.time.elapsed}')`).join('<br>');

          scorers.innerHTML = `
            <div><strong>${home} :</strong><br>${homeList || "—"}</div>
            <div><strong>${away} :</strong><br>${awayList || "—"}</div>
          `;
        } else {
          scorers.innerHTML = "<p>Aucun buteur pour le moment.</p>";
        }

        card.appendChild(title);
        card.appendChild(time);
        card.appendChild(scorers);
        scoresDiv.appendChild(card);

        previousScores[matchId] = { home: scoreHome, away: scoreAway };
      }
    }

  } catch (error) {
    console.error("Erreur :", error);
    document.getElementById('scores').innerHTML = `<p>Erreur : ${error.message}</p>`;
  }
}

getLiveScores();
setInterval(getLiveScores, 65000);
