let bitcoinPrice = 1000;
let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 1000;
let history = JSON.parse(localStorage.getItem("history")) || [];

document.getElementById("bitcoin-price").innerText = bitcoinPrice;
document.getElementById("balance").innerText = balance;

function updateHistory(message) {
    history.push(message);
    localStorage.setItem("history", JSON.stringify(history));
    const historyList = document.getElementById("history");
    const li = document.createElement("li");
    li.textContent = message;
    historyList.appendChild(li);
}

function updateBalance(amount) {
    balance += amount;
    localStorage.setItem("balance", balance);
    document.getElementById("balance").innerText = balance;
}

function updateBitcoinPrice() {
    const change = Math.floor(Math.random() * 200 - 100); // Montée ou descente aléatoire
    bitcoinPrice += change;
    if (bitcoinPrice < 0) bitcoinPrice = 0;
    document.getElementById("bitcoin-price").innerText = bitcoinPrice;
    updateHistory(`Le prix a changé de ${change} $`);
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

    const previousPrice = bitcoinPrice;
    updateBitcoinPrice();

    if ((direction === "up" && bitcoinPrice > previousPrice) || 
        (direction === "down" && bitcoinPrice < previousPrice)) {
        updateBalance(betAmount);
        updateHistory(`+${betAmount} $ (Gagné)`);
        alert("Gagné !");
    } else {
        updateBalance(-betAmount);
        updateHistory(`-${betAmount} $ (Perdu)`);
        alert("Perdu !");
    }
}

// Met à jour automatiquement toutes les 3 heures (10800000 ms)
setInterval(updateBitcoinPrice, 10800000);

// Charger l'historique au démarrage
window.onload = () => {
    history.forEach(message => {
        const li = document.createElement("li");
        li.textContent = message;
        document.getElementById("history").appendChild(li);
    });
};
