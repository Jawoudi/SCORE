const apiKey = 'deac4b05c2d34e0f947459c8d0b03260';
const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4';

const scoresDiv = document.getElementById('scores');
const searchInput = document.getElementById('search');

let allMatches = [];

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // format YYYY-MM-DD
}

async function getMatchDetails(matchId) {
  const res = await fetch(`${baseURL}/matches/${matchId}`, {
    headers: { 'X-Auth-Token': apiKey }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

async function loadMatches() {
  scoresDiv.innerHTML = "Chargement des matchs...";
  const today = getTodayDate();

  try {
    const res = await fetch(`${baseURL}/matches?dateFrom=${today}&dateTo=${today}`, {
      headers: { 'X-Auth-Token': apiKey }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allMatches = data.matches;

    displayMatches(allMatches);

  } catch (err) {
    console.error("Erreur API :", err);
    scoresDiv.innerHTML = `<p>Erreur : ${err.message}</p>`;
  }
}

function displayMatches(matches) {
  scoresDiv.innerHTML = "";

  matches.forEach(async (match) => {
    const card = document.createElement("div");
    card.className = "match-card";

    const home = match.homeTeam.name;
    const away = match.awayTeam.name;
    const scoreHome = match.score.fullTime.homeTeam ?? 0;
    const scoreAway = match.score.fullTime.awayTeam ?? 0;
    const status = match.status;
    const matchId = match.id;

    // Animation si le match est LIVE
    if (status === "IN_PLAY") {
      card.classList.add("live-flash");
    }

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
    scorersDiv.innerHTML = `<em>Chargement des buteurs...</em>`;

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(scorersDiv);
    scoresDiv.appendChild(card);

    // Détails : minute + buteurs
    const details = await getMatchDetails(matchId);
    const goals = details?.match?.events?.filter(e => e.type === "GOAL") || [];

    if (goals.length > 0) {
      scorersDiv.innerHTML = "";
      goals.forEach(goal => {
        const scorer = goal.player.name;
        const team = goal.team.name;
        const minute = goal.minute;

        const goalText = document.createElement("p");
        goalText.innerHTML = `⚽ <strong>${scorer}</strong> (${team}) - ${minute}'`;
        scorersDiv.appendChild(goalText);
      });
    } else {
      scorersDiv.innerHTML = "<p>Aucun buteur répertorié.</p>";
    }
  });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allMatches.filter(match =>
    match.homeTeam.name.toLowerCase().includes(term) ||
    match.awayTeam.name.toLowerCase().includes(term)
  );
  displayMatches(filtered);
});

// Auto refresh toutes les 1:05
loadMatches();
setInterval(loadMatches, 65000);
