let bitcoinPrice = 1000;
let balance = 1000;
let lastBetPrice = bitcoinPrice;
let history = [];
let chartData = [bitcoinPrice];
let chartLabels = [0];
let betPlaced = false;

const priceElement = document.getElementById("bitcoin-price");
const balanceElement = document.getElementById("balance");
const historyElement = document.getElementById("history");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function updateBitcoinPrice() {
    const change = Math.floor(Math.random() * 100 - 50); // -50 à +50
    bitcoinPrice += change;
    if (bitcoinPrice < 0) bitcoinPrice = 0;
    priceElement.innerText = bitcoinPrice;

    // Mettre à jour le graphique
    chartData.push(bitcoinPrice);
    chartLabels.push(chartLabels.length);
    drawChart();
}

function bet(direction) {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Entrez une mise valide !");
        return;
    }

    if (betAmount > balance) {
        alert("Balance insuffisante !");
        return;
    }

    if (!betPlaced) {
        alert("Attends que le cours change avant de parier !");
        return;
    }

    if ((direction === "up" && bitcoinPrice > lastBetPrice) || 
        (direction === "down" && bitcoinPrice < lastBetPrice)) {
        balance += betAmount;
        addHistory(`+${betAmount} $ (Gagné)`);
        alert("Gagné !");
    } else {
        balance -= betAmount;
        addHistory(`-${betAmount} $ (Perdu)`);
        alert("Perdu !");
    }

    balanceElement.innerText = balance;
    lastBetPrice = bitcoinPrice;
    betPlaced = false; // Parier à nouveau seulement après un changement de cours
}

function addHistory(message) {
    history.push(message);
    const li = document.createElement("li");
    li.textContent = message;
    historyElement.appendChild(li);
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - chartData[0] / 10);
    for (let i = 1; i < chartData.length; i++) {
        const x = (i / chartLabels.length) * canvas.width;
        const y = canvas.height - chartData[i] / 10;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Changer le prix toutes les 3 secondes (pour tester) ou 3 heures (10800000 ms)
setInterval(() => {
    updateBitcoinPrice();
    betPlaced = true;
}, 3000);

drawChart();
