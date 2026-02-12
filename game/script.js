const config = JSON.parse(localStorage.getItem("gameConfig"));

if (!config) {
    window.location.href = "../levels/index.html";
}

document.getElementById("levelName").textContent = config.levelName;

let score = 0;
let lives = config.lives;
let remainingCalls = config.totalCalls;
let timeLeft = config.timePerCall;
let timerInterval;

const calls = [
    { text: "O botão não está alinhado corretamente.", role: "frontend" },
    { text: "A API está retornando erro 500.", role: "backend" },
    { text: "Pipeline de deploy falhou.", role: "devops" },
    { text: "Usuários estão confusos com o layout.", role: "ux" },
    { text: "Bug crítico encontrado em produção.", role: "qa" },
    { text: "Consulta ao banco está lenta.", role: "data" }
];

let currentCall;

function updateHUD() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("timer").textContent = timeLeft;
}

function startTimer() {
    timeLeft = config.timePerCall;
    updateHUD();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateHUD();

        if (timeLeft <= 0) {
            handleWrong();
        }
    }, 1000);
}

function loadCall() {
    if (remainingCalls <= 0 || lives <= 0) {
        endGame();
        return;
    }

    currentCall = calls[Math.floor(Math.random() * calls.length)];
    document.getElementById("callText").textContent = currentCall.text;

    remainingCalls--;
    startTimer();
}

function handleCorrect() {
    score += 100;
    clearInterval(timerInterval);
    loadCall();
}

function handleWrong() {
    lives--;
    clearInterval(timerInterval);
    loadCall();
}

function endGame() {
    localStorage.setItem("finalScore", score);
    window.location.href = "../report/index.html";
}

document.querySelectorAll(".drop-zone").forEach(zone => {

    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    zone.addEventListener("drop", () => {
        const selectedRole = zone.dataset.role;

        if (selectedRole === currentCall.role) {
            handleCorrect();
        } else {
            handleWrong();
        }
    });
});

loadCall();
updateHUD();
