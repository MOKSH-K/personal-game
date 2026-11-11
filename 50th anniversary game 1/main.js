const container = document.getElementById("gameContainer");

const colors = [
    "#e9a6b4",
    "#8bd4d5",
    "#f5c5a4",
    "#a9b9ef",
    "#f4d77d",
    "#b5d9b6",
    "#d5b6e8",
    "#f2aaa0",
    "#a8c9df",
    "#f0c2d7",
    "#f3d5a5",
    "#b4d4ca"
];

let games = Array.from({length: 30}, (_, i) => i + 1);

let visited = new Set();
const gameFromUrl = new URLSearchParams(window.location.search).get("game");
const selectedGame = Number(gameFromUrl);

function markGameVisited(number) {
    if (visited.has(number)) return;

    visited.add(number);

    const card = document.querySelector(`[data-number="${number}"]`);
    if (card) {
        disableVisitedCard(card, number);
        card.querySelector(".card-text").textContent = "ALREADY OPENED";
    }

    updateStats();
}

function disableVisitedCard(card, number) {
    card.classList.add("visited");
    card.setAttribute("aria-disabled", "true");
    card.setAttribute("aria-label", `Game ${number} already opened`);
    card.removeAttribute("href");
    card.removeAttribute("target");
    card.tabIndex = -1;
}

function createCards() {

    container.innerHTML = "";

    games.forEach((number, index) => {

        const card = document.createElement("a");

        card.className = "game-card";
        const gameUrl = new URL(window.location.href);
        gameUrl.searchParams.set("game", number);
        card.href = gameUrl.href;
        card.target = "_blank";
        card.rel = "noopener";
        card.setAttribute("aria-label", `Open game ${number} in a new tab`);

        card.dataset.number = number;

        card.style.backgroundColor =
            colors[(index) % colors.length];

        card.style.animationDelay = `${index * 0.025}s`;

        if (visited.has(number)) {
            disableVisitedCard(card, number);
        }

        card.innerHTML = `
            <div class="card-number">${number}</div>
            <div class="card-text">${visited.has(number) ? "ALREADY OPENED" : "TAP TO EXPLORE"}</div>
        `;

        card.addEventListener("click", event => {
            if (visited.has(number)) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            openGame(number);
        });


        container.appendChild(card);

    });

    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.id = "noResults";
    noResults.textContent = "No games found! Try another number.";

    container.appendChild(noResults);

    updateStats();
    searchGames();
}

function updateStats() {

    const count = visited.size;
    const counter = document.getElementById("counter");
    const progressFill = document.getElementById("progressFill");

    if (counter) {
        counter.textContent = `${count} / 30`;
    }

    if (progressFill) {
        progressFill.style.width = `${(count / 30) * 100}%`;
    }
}

function showPlaceholder(number) {
    document.body.classList.add("placeholder-mode");
    document.title = `Family Game ${number}`;
    document.getElementById("placeholderPage").innerHTML = `
        <div class="placeholder-box">
            <div class="placeholder-label">FAMILY GAME NIGHT</div>
            <h1>Game ${number}</h1>
            <div class="placeholder-text">TO BE DECIDED</div>
            <p>Something exciting is coming soon!</p>
        </div>
    `;
}

// Open a randomly selected game from the surprise button.
function openGame(number) {
    if (visited.has(number)) return;

    const gameUrl = new URL(window.location.href);
    gameUrl.searchParams.set("game", number);
    window.open(gameUrl.href, "_blank", "noopener");
    markGameVisited(number);
}

// Random game selection

function surpriseMe() {

    const availableGames = games.filter(number => !visited.has(number));
    if (availableGames.length === 0) return;

    const randomNumber =
        availableGames[Math.floor(Math.random() * availableGames.length)];

    const card = document.querySelector(
        `[data-number="${randomNumber}"]`
    );

    if (!card) return;

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    card.classList.add("highlight");
    openGame(randomNumber);
    setTimeout(() => card.classList.remove("highlight"), 900);

}

// Shuffle cards

function shuffleGames() {

    for (let i = games.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [games[i], games[j]] = [games[j], games[i]];

    }

    createCards();

}

// Search game number

function searchGames() {

    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const value = searchInput.value;

    const cards = document.querySelectorAll(".game-card");

    let found = false;

    cards.forEach(card => {

        const match =
            value === "" ||
            card.dataset.number.includes(value);

        card.style.display = match ? "flex" : "none";

        if (match) found = true;

    });

    document.getElementById("noResults").style.display =
        found ? "none" : "block";
}

if (gameFromUrl !== null && Number.isInteger(selectedGame) && selectedGame >= 1 && selectedGame <= 30) {
    showPlaceholder(selectedGame);
} else {
    createCards();
}