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

const totalGames = 20;
let games = Array.from({length: totalGames}, (_, i) => i + 1);
const movieChallenges = [
    "✈️ ✋ 🅱️",
    "🏃🏽‍♂️🥛 🏃🏽‍♂️",
    "👳‍♂️👉🤴"
];
const movieAssignmentPrefix = "familyGameNight.movieAssignments.";

function createMovieAssignments() {
    const available = games.filter(number =>
        number >= 1 &&
        number <= totalGames
    );
    const chosen = [];

    while (chosen.length < movieChallenges.length) {
        const number = available[Math.floor(Math.random() * available.length)];
        if (!chosen.includes(number) &&
            chosen.every(chosenNumber => Math.abs(chosenNumber - number) > 1)) {
            chosen.push(number);
        }
    }

    chosen.sort((a, b) => a - b);
    return Object.fromEntries(
        chosen.map((number, index) => [number, index])
    );
}

function readMovieAssignments(value) {
    if (!value) return null;

    const assignments = {};
    const usedIndexes = new Set();

    for (const entry of value.split(",")) {
        const parts = entry.split("-");
        if (parts.length !== 2) return null;

        const number = Number(parts[0]);
        const index = Number(parts[1]);
        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > totalGames ||
            !Number.isInteger(index) ||
            index < 0 ||
            index >= movieChallenges.length ||
            assignments[number] !== undefined ||
            usedIndexes.has(index)
        ) {
            return null;
        }

        assignments[number] = index;
        usedIndexes.add(index);
    }

    const assignedNumbers = Object.keys(assignments).map(Number);
    const hasAdjacentCards = assignedNumbers.some((number, index) =>
        assignedNumbers.some((otherNumber, otherIndex) =>
            index !== otherIndex && Math.abs(number - otherNumber) === 1
        )
    );

    return usedIndexes.size === movieChallenges.length && !hasAdjacentCards
        ? assignments
        : null;
}

function encodeMovieAssignments(assignments) {
    return Object.entries(assignments)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([number, index]) => `${number}-${index}`)
        .join(",");
}

const savedMovieAssignments = readMovieAssignments(
    localStorage.getItem(movieAssignmentPrefix)
);
const movieAssignments = savedMovieAssignments || createMovieAssignments();
localStorage.setItem(
    movieAssignmentPrefix,
    encodeMovieAssignments(movieAssignments)
);

const tongueTwisters = [
    "काली कुकड़ काले कुकड़ खे कुटे।",
    "लाल लोलो, लोलो लाल, लाल लोलो खाए लाल।",
    "नीली रेल, लाल रेल, नीली रेल, लाल रेल।",
    "पीतल के पतीले में पपीता पीला-पीला",
    "नदी किनारे किराने की दुकान।"
];
const tongueTwisterAssignmentPrefix = "familyGameNight.tongueTwisterAssignments.";

function createTongueTwisterAssignments() {
    const excludedNumbers = Object.keys(movieAssignments).map(Number);
    const available = games.filter(number =>
        !excludedNumbers.includes(number) &&
        excludedNumbers.every(movieNumber => Math.abs(movieNumber - number) > 1)
    );
    const chosen = [];

    while (chosen.length < tongueTwisters.length) {
        const number = available[Math.floor(Math.random() * available.length)];
        if (!chosen.includes(number) &&
            chosen.every(chosenNumber => Math.abs(chosenNumber - number) > 1)) {
            chosen.push(number);
        }
    }

    chosen.sort((a, b) => a - b);
    return Object.fromEntries(
        chosen.map((number, index) => [number, index])
    );
}

function readTongueTwisterAssignments(value) {
    if (!value) return null;

    const assignments = {};
    const usedIndexes = new Set();
    const movieNumbers = Object.keys(movieAssignments).map(Number);

    for (const entry of value.split(",")) {
        const parts = entry.split("-");
        if (parts.length !== 2) return null;

        const number = Number(parts[0]);
        const index = Number(parts[1]);
        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > totalGames ||
            movieNumbers.includes(number) ||
            !Number.isInteger(index) ||
            index < 0 ||
            index >= tongueTwisters.length ||
            assignments[number] !== undefined ||
            usedIndexes.has(index)
        ) {
            return null;
        }

        assignments[number] = index;
        usedIndexes.add(index);
    }

    const assignedNumbers = Object.keys(assignments).map(Number);
    const areSeparated = assignedNumbers.every((number, index) =>
        assignedNumbers.every((otherNumber, otherIndex) =>
            index === otherIndex || Math.abs(number - otherNumber) > 1
        )
    ) && assignedNumbers.every(number =>
        movieNumbers.every(movieNumber => Math.abs(number - movieNumber) > 1)
    );

    return usedIndexes.size === tongueTwisters.length && areSeparated
        ? assignments
        : null;
}

function encodeTongueTwisterAssignments(assignments) {
    return Object.entries(assignments)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([number, index]) => `${number}-${index}`)
        .join(",");
}

const savedTongueTwisterAssignments = readTongueTwisterAssignments(
    localStorage.getItem(tongueTwisterAssignmentPrefix)
);
const tongueTwisterAssignments =
    savedTongueTwisterAssignments || createTongueTwisterAssignments();
localStorage.setItem(
    tongueTwisterAssignmentPrefix,
    encodeTongueTwisterAssignments(tongueTwisterAssignments)
);

const dialogueGame = "अपने पसंदीदा अभिनेता या अभिनेत्री का कोई एक मशहूर डायलॉग बताएं और उसे करके भी दिखाएं।";
const dialogueAssignmentPrefix = "familyGameNight.dialogueAssignment.";

function createDialogueAssignment() {
    const reservedNumbers = [
        ...Object.keys(movieAssignments).map(Number),
        ...Object.keys(tongueTwisterAssignments).map(Number)
    ];
    const available = games.filter(number =>
        !reservedNumbers.includes(number) &&
        reservedNumbers.every(reservedNumber => Math.abs(reservedNumber - number) > 1)
    );

    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

const savedDialogueAssignment = Number(
    localStorage.getItem(dialogueAssignmentPrefix)
);
const reservedDialogueNumbers = [
    ...Object.keys(movieAssignments).map(Number),
    ...Object.keys(tongueTwisterAssignments).map(Number)
];
const dialogueAssignment =
    Number.isInteger(savedDialogueAssignment) &&
    savedDialogueAssignment >= 1 &&
    savedDialogueAssignment <= totalGames &&
    !reservedDialogueNumbers.includes(savedDialogueAssignment) &&
    reservedDialogueNumbers.every(number =>
        Math.abs(number - savedDialogueAssignment) > 1
    )
        ? savedDialogueAssignment
        : createDialogueAssignment();

if (dialogueAssignment !== null) {
    localStorage.setItem(dialogueAssignmentPrefix, dialogueAssignment);
}

const familyFactGame = "परिवार के किसी भी सदस्‍य की कोई खास बात बताईये";
const familyFactAssignmentPrefix = "familyGameNight.familyFactAssignment.";
const reservedFamilyFactNumbers = [
    ...Object.keys(movieAssignments).map(Number),
    ...Object.keys(tongueTwisterAssignments).map(Number),
    ...(dialogueAssignment !== null ? [dialogueAssignment] : [])
];
const availableFamilyFactNumbers = games.filter(number =>
    !reservedFamilyFactNumbers.includes(number)
);
const savedFamilyFactAssignment = Number(
    localStorage.getItem(familyFactAssignmentPrefix)
);
const familyFactAssignment =
    Number.isInteger(savedFamilyFactAssignment) &&
    availableFamilyFactNumbers.includes(savedFamilyFactAssignment)
        ? savedFamilyFactAssignment
        : availableFamilyFactNumbers[
            Math.floor(Math.random() * availableFamilyFactNumbers.length)
        ];
localStorage.setItem(familyFactAssignmentPrefix, familyFactAssignment);

const songGame = "कोई भी गाना गईये";
const songAssignmentPrefix = "familyGameNight.songAssignment.";
const reservedSongNumbers = [
    ...reservedFamilyFactNumbers,
    familyFactAssignment
];
const availableSongNumbers = games.filter(number =>
    !reservedSongNumbers.includes(number)
);
const savedSongAssignment = Number(
    localStorage.getItem(songAssignmentPrefix)
);
const songAssignment =
    Number.isInteger(savedSongAssignment) &&
    availableSongNumbers.includes(savedSongAssignment)
        ? savedSongAssignment
        : availableSongNumbers[
            Math.floor(Math.random() * availableSongNumbers.length)
        ];
localStorage.setItem(songAssignmentPrefix, songAssignment);

const laughGame = "10 सेकंड के लिए हँसे दिखाये";
const laughAssignmentPrefix = "familyGameNight.laughAssignment.";
const reservedLaughNumbers = [
    ...reservedSongNumbers,
    songAssignment
];
const availableLaughNumbers = games.filter(number =>
    !reservedLaughNumbers.includes(number)
);
const savedLaughAssignment = Number(
    localStorage.getItem(laughAssignmentPrefix)
);
const laughAssignment =
    Number.isInteger(savedLaughAssignment) &&
    availableLaughNumbers.includes(savedLaughAssignment)
        ? savedLaughAssignment
        : availableLaughNumbers[
            Math.floor(Math.random() * availableLaughNumbers.length)
        ];
localStorage.setItem(laughAssignmentPrefix, laughAssignment);

const neighborGame = "अपने पड़ोसी को हसाके दिखाये";
const neighborAssignmentPrefix = "familyGameNight.neighborAssignment.";
const reservedNeighborNumbers = [
    ...reservedLaughNumbers,
    laughAssignment
];
const availableNeighborNumbers = games.filter(number =>
    !reservedNeighborNumbers.includes(number)
);
const savedNeighborAssignment = Number(
    localStorage.getItem(neighborAssignmentPrefix)
);
const neighborAssignment =
    Number.isInteger(savedNeighborAssignment) &&
    availableNeighborNumbers.includes(savedNeighborAssignment)
        ? savedNeighborAssignment
        : availableNeighborNumbers[
            Math.floor(Math.random() * availableNeighborNumbers.length)
        ];
localStorage.setItem(neighborAssignmentPrefix, neighborAssignment);

const expressionGame = "“वाह क्या बात है”, इस वाक्य को 3 अलग स्टाइल में बोल के दिखाइये";
const expressionAssignmentPrefix = "familyGameNight.expressionAssignment.";
const reservedExpressionNumbers = [
    ...reservedNeighborNumbers,
    neighborAssignment
];
const availableExpressionNumbers = games.filter(number =>
    !reservedExpressionNumbers.includes(number)
);
const savedExpressionAssignment = Number(
    localStorage.getItem(expressionAssignmentPrefix)
);
const expressionAssignment =
    Number.isInteger(savedExpressionAssignment) &&
    availableExpressionNumbers.includes(savedExpressionAssignment)
        ? savedExpressionAssignment
        : availableExpressionNumbers[
            Math.floor(Math.random() * availableExpressionNumbers.length)
        ];
localStorage.setItem(expressionAssignmentPrefix, expressionAssignment);

const excuseGame = "सबसे मज़ेदार बहाना जो आपने देर आने पर दिया हो";
const excuseAssignmentPrefix = "familyGameNight.excuseAssignment.";
const reservedExcuseNumbers = [
    ...reservedExpressionNumbers,
    expressionAssignment
];
const availableExcuseNumbers = games.filter(number =>
    !reservedExcuseNumbers.includes(number)
);
const savedExcuseAssignments = (
    localStorage.getItem(excuseAssignmentPrefix) || ""
)
    .split(",")
    .map(Number)
    .filter((number, index, assignments) =>
        Number.isInteger(number) &&
        availableExcuseNumbers.includes(number) &&
        assignments.indexOf(number) === index
    )
    .slice(0, 2);

while (savedExcuseAssignments.length < 2) {
    const remainingExcuseNumbers = availableExcuseNumbers.filter(number =>
        !savedExcuseAssignments.includes(number)
    );
    savedExcuseAssignments.push(
        remainingExcuseNumbers[
            Math.floor(Math.random() * remainingExcuseNumbers.length)
        ]
    );
}

const excuseAssignments = savedExcuseAssignments;
localStorage.setItem(excuseAssignmentPrefix, excuseAssignments.join(","));

const actingGame = "आपके मनपसंद अभिनेता या अभिनेत्री की एक्टिंग करके दिखाइये";
const actingAssignmentPrefix = "familyGameNight.actingAssignment.";
const reservedActingNumbers = [
    ...reservedExcuseNumbers,
    ...excuseAssignments
];
const availableActingNumbers = games.filter(number =>
    !reservedActingNumbers.includes(number)
);
const savedActingAssignment = Number(
    localStorage.getItem(actingAssignmentPrefix)
);
const actingAssignment =
    Number.isInteger(savedActingAssignment) &&
    availableActingNumbers.includes(savedActingAssignment)
        ? savedActingAssignment
        : availableActingNumbers[
            Math.floor(Math.random() * availableActingNumbers.length)
        ];
localStorage.setItem(actingAssignmentPrefix, actingAssignment);

const primeMinisterGame = "अगर आप देश के प्रधानमंत्री होते तो क्या एक बड़ा बदलाव लाना चाहते";
const primeMinisterAssignmentPrefix = "familyGameNight.primeMinisterAssignments.";
const availablePrimeMinisterNumbers = games.filter(number =>
    !reservedActingNumbers.includes(number) &&
    number !== actingAssignment
);
const savedPrimeMinisterAssignments = (
    localStorage.getItem(primeMinisterAssignmentPrefix) || ""
)
    .split(",")
    .map(Number)
    .filter((number, index, assignments) =>
        Number.isInteger(number) &&
        availablePrimeMinisterNumbers.includes(number) &&
        assignments.indexOf(number) === index
    )
    .slice(0, 2);

while (savedPrimeMinisterAssignments.length < 2) {
    const remainingPrimeMinisterNumbers = availablePrimeMinisterNumbers.filter(number =>
        !savedPrimeMinisterAssignments.includes(number)
    );
    savedPrimeMinisterAssignments.push(
        remainingPrimeMinisterNumbers[
            Math.floor(Math.random() * remainingPrimeMinisterNumbers.length)
        ]
    );
}

const primeMinisterAssignments = savedPrimeMinisterAssignments;
localStorage.setItem(
    primeMinisterAssignmentPrefix,
    primeMinisterAssignments.join(",")
);

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
        counter.textContent = `${count} / ${games.length}`;
    }

    if (progressFill) {
        progressFill.style.width = `${(count / games.length) * 100}%`;
    }
}

function showPlaceholder(number) {
    document.body.classList.add("placeholder-mode");
    document.title = `Family Game ${number}`;
    const placeholderPage = document.getElementById("placeholderPage");
    const tongueTwisterIndex = tongueTwisterAssignments[number];
    const movieIndex = movieAssignments[number];

    if (number === familyFactAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">परिवार की खास बात</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = familyFactGame;
        return;
    }

    if (number === songAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">गाने का चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = songGame;
        return;
    }

    if (number === laughAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">हँसी चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = laughGame;
        return;
    }

    if (number === neighborAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">पड़ोसी चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = neighborGame;
        return;
    }

    if (number === expressionAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">बोलने का चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = expressionGame;
        return;
    }

    if (excuseAssignments.includes(number)) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">मज़ेदार बहाना</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = excuseGame;
        return;
    }

    if (number === actingAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">एक्टिंग चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = actingGame;
        return;
    }

    if (primeMinisterAssignments.includes(number)) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">प्रधानमंत्री चैलेंज</div>
                <div class="placeholder-text"></div>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent =
            primeMinisterGame;
        return;
    }

    if (number === dialogueAssignment) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">डायलॉग चैलेंज</div>
                <div class="placeholder-text"></div>
                <p>यह डायलॉग बोलें और उसका अभिनय करें!</p>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent = dialogueGame;
        return;
    }

    if (tongueTwisterIndex !== undefined) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">TONGUE TWISTERS</div>
                <div class="placeholder-text"></div>
                <p>Say it three times fast!</p>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent =
            tongueTwisters[tongueTwisterIndex];
        return;
    }

    if (movieIndex !== undefined) {
        placeholderPage.innerHTML = `
            <div class="placeholder-box">
                <div class="placeholder-label">FAMILY GAME NIGHT</div>
                <h1 class="game-number">Game ${number}</h1>
                <div class="game-box-label">फिल्म का नाम बताएं</div>
                <div class="placeholder-text"></div>
                <p>Guess the movie name!</p>
            </div>
        `;
        placeholderPage.querySelector(".placeholder-text").textContent =
            movieChallenges[movieIndex];
        return;
    }

    placeholderPage.innerHTML = `
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

if (gameFromUrl !== null && Number.isInteger(selectedGame) && selectedGame >= 1 && selectedGame <= totalGames) {
    showPlaceholder(selectedGame);
} else {
    createCards();
}
