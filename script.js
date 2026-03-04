const DARJIA_WORDS = {
  khobz: ["food", "kitchen", "daily"],
  ma: ["drink", "kitchen", "daily"],
  atay: ["drink", "social", "kitchen"],
  qahwa: ["drink", "social", "morning"],
  dar: ["home", "family", "daily"],
  bit: ["home", "sleep", "inside"],
  zen9a: ["outside", "city", "transport"],
  tomobil: ["transport", "city", "daily"],
  bus: ["transport", "city", "public"],
  souq: ["city", "shopping", "social"],
  flous: ["money", "shopping", "daily"],
  khedma: ["work", "daily", "city"],
  qra: ["school", "work", "future"],
  shita: ["weather", "outside", "season"],
  shams: ["weather", "outside", "day"],
  barda: ["weather", "outside", "season"],
  s7ab: ["family", "social", "outside"],
  yemma: ["family", "home", "love"],
  baba: ["family", "home", "love"],
  drari: ["family", "social", "daily"],
  makla: ["food", "kitchen", "social"],
  l7am: ["food", "kitchen", "shopping"],
  khodra: ["food", "shopping", "kitchen"],
  hlib: ["food", "drink", "kitchen"],
  dlam: ["night", "outside", "day"],
  nhar: ["day", "daily", "outside"]
};

const words = Object.keys(DARJIA_WORDS);

const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const statusEl = document.getElementById("status");
const tableBody = document.getElementById("guesses-body");
const newGameBtn = document.getElementById("new-game");

let secret = "";
let ranking = [];
let guessed = [];

function normalize(text) {
  return text.trim().toLowerCase();
}

function scoreWord(wordA, wordB) {
  const a = DARJIA_WORDS[wordA] || [];
  const b = DARJIA_WORDS[wordB] || [];

  if (!a.length || !b.length) return 0;

  const setA = new Set(a);
  const setB = new Set(b);
  const overlap = [...setA].filter((tag) => setB.has(tag)).length;
  const union = new Set([...a, ...b]).size;

  return overlap / union;
}

function computeRanking(secretWord) {
  return words
    .map((word) => ({ word, score: scoreWord(word, secretWord) }))
    .sort((x, y) => y.score - x.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function rankFor(word) {
  return ranking.find((item) => item.word === word);
}

function closenessPercent(score) {
  return `${Math.round(score * 100)}%`;
}

function renderGuesses() {
  tableBody.innerHTML = "";
  guessed.forEach((guess, idx) => {
    const item = rankFor(guess);
    const tr = document.createElement("tr");
    const rankClass = item.rank === 1 ? "rank-1" : "";
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${guess}</td>
      <td class="${rankClass}">#${item.rank}</td>
      <td>${closenessPercent(item.score)}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = `status ${type}`.trim();
}

function startGame() {
  secret = words[Math.floor(Math.random() * words.length)];
  ranking = computeRanking(secret);
  guessed = [];
  renderGuesses();
  setStatus("New secret word selected. Yalla, guess!", "");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = normalize(input.value);
  input.value = "";

  if (!guess) return;

  if (!DARJIA_WORDS[guess]) {
    setStatus("Unknown word in this demo dictionary. Try another Darija word.", "warn");
    return;
  }

  if (guessed.includes(guess)) {
    setStatus("You already guessed this word.", "warn");
    return;
  }

  guessed.push(guess);
  guessed.sort((a, b) => rankFor(a).rank - rankFor(b).rank);
  renderGuesses();

  if (guess === secret) {
    setStatus(`Sahha! You found the secret word "${secret}" 🎉`, "win");
    return;
  }

  const item = rankFor(guess);
  setStatus(`"${guess}" is rank #${item.rank}. Keep going!`, "");
});

newGameBtn.addEventListener("click", startGame);
startGame();
