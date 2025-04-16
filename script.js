const apiKey = 'deac4b05c2d34e0f947459c8d0b03260';
const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4';

async function getMatchDetails(matchId) {
  const response = await fetch(`${baseURL}/matches/${matchId}`, {
    headers: {
      'X-Auth-Token': apiKey
    }
  });

  if (!response.ok) {
    console.error("Erreur récupération détails match", matchId);
    return null;
  }

  const data = await response.json();
  return data;
}

async function getLiveScores() {
  const scoresDiv = document.getElementById('scores');
  scoresDiv.innerHTML = "Chargement...";

  try {
    const response = await fetch(`${baseURL}/matches`, {
      headers: {
        'X-Auth-Token': apiKey
      }
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();

    const liveMatches = data.matches.filter(match => match.status !== 'FINISHED');

    if (liveMatches.length === 0) {
      scoresDiv.innerHTML = "<p>Aucun match en direct actuellement.</p>";
      return;
    }

    scoresDiv.innerHTML = ""; // Reset l'affichage

    for (const match of liveMatches) {
      const home = match.homeTeam.name;
      const away = match.awayTeam.name;
      const scoreHome = match.score.fullTime.homeTeam ?? 0;
      const scoreAway = match.score.fullTime.awayTeam ?? 0;
      const status = match.status;
      const matchId = match.id;

      const card = document.createElement("div");
      card.className = "match-card";

      const title = document.createElement("div");
      title.className = "teams-row";
      title.innerHTML = `
        <div class="team"><span>${home}</span></div>
        <strong>${scoreHome} - ${scoreAway}</strong>
        <div class="team"><span>${away}</span></div>
      `;

      const time = document.createElement("div");
      time.className = "match-minute";
      time.textContent = `Statut : ${status}`;

      const scorersDiv = document.createElement("div");
      scorersDiv.className = "scorers";
      scorersDiv.innerHTML = "<em>Chargement des buteurs...</em>";

      card.appendChild(title);
      card.appendChild(time);
      card.appendChild(scorersDiv);
      scoresDiv.appendChild(card);

      // Détails des buteurs
      const matchDetails = await getMatchDetails(matchId);
      const goalEvents = matchDetails?.match?.events?.filter(e => e.type === "GOAL") || [];

      if (goalEvents.length > 0) {
        scorersDiv.innerHTML = "";
        goalEvents.forEach(goal => {
          const scorerName = goal.player.name;
          const teamName = goal.team.name;
          const minute = goal.minute;

          const goalLine = document.createElement("p");
          goalLine.innerHTML = `⚽ <strong>${scorerName}</strong> (${teamName}) - ${minute}'`;
          scorersDiv.appendChild(goalLine);
        });
      } else {
        scorersDiv.innerHTML = "<p>Pas de but pour l’instant.</p>";
      }
    }

  } catch (error) {
    console.error("Erreur :", error);
    scoresDiv.innerHTML = `<p>Erreur : ${error.message}</p>`;
  }
}

getLiveScores();
setInterval(getLiveScores, 65000); // Rafraîchit toutes les 1min05
