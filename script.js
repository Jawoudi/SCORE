const apiKey = 'deac4b05c2d34e0f947459c8d0b03260'; // Ta clé API Football-Data.org
const apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/matches'; // Ajout du Proxy

async function getLiveScores() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiKey
      }
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    const scoresDiv = document.getElementById('scores');
    scoresDiv.innerHTML = "";

    if (data.matches.length === 0) {
      scoresDiv.innerHTML = "<p>Aucun match en direct actuellement.</p>";
    } else {
      data.matches.forEach(match => {
        const home = match.homeTeam.name;
        const away = match.awayTeam.name;
        const scoreHome = match.score.fullTime.homeTeam ?? 0;
        const scoreAway = match.score.fullTime.awayTeam ?? 0;
        const status = match.status;

        // Carte du match
        const card = document.createElement("div");
        card.className = "match-card";

        const title = document.createElement("div");
        title.className = "teams-row";
        title.innerHTML = `
          <div class="team">
            <span>${home}</span>
          </div>
          <strong>${scoreHome} - ${scoreAway}</strong>
          <div class="team">
            <span>${away}</span>
          </div>
        `;

        const time = document.createElement("div");
        time.className = "match-minute";
        time.textContent = `Statut: ${status}`;

        card.appendChild(title);
        card.appendChild(time);
        scoresDiv.appendChild(card);
      });
    }

  } catch (error) {
    console.error("Erreur :", error);
    document.getElementById('scores').innerHTML = `<p>Erreur : ${error.message}</p>`;
  }
}

getLiveScores();
setInterval(getLiveScores, 65000); // Rafraîchissement toutes les 1min05
