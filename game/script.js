// ===== Configuração =====
const config = JSON.parse(localStorage.getItem("gameConfig"));

if (!config) {
    window.location.href = "../levels/index.html";
}

// ===== Variáveis Globais =====
let score = 0;
let lives = config.lives;
let remainingCalls = config.totalCalls;
let timeLeft = config.timePerCall;
let timerInterval;

let totalAnswered = 0;
let correctAnswers = 0;

document.getElementById("levelName").textContent = config.levelName;

// ===== Chamados =====
const calls = [
    { text: "O botão não está alinhado corretamente.", role: "frontend" },
    { text: "A API está retornando erro 500.", role: "backend" },
    { text: "Pipeline de deploy falhou.", role: "devops" },
    { text: "Usuários estão confusos com o layout.", role: "ux" },
    { text: "Bug crítico encontrado em produção.", role: "qa" },
    { text: "Consulta ao banco está lenta.", role: "data" }
];

let currentCall;

// ===== HUD =====
function updateHUD() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("timer").textContent = timeLeft;
}

// ===== Timer =====
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

// ===== Carregar Chamado =====
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

// ===== Resposta Correta =====
function handleCorrect() {
    score += 100;
    correctAnswers++;
    totalAnswered++;
    clearInterval(timerInterval);

    showFeedback(
        true,
        "Boa decisão!",
        `O ${formatRole(currentCall.role)} é responsável por esse tipo de chamado.`
    );
}

// ===== Resposta Errada =====
function handleWrong() {
    lives--;
    totalAnswered++;
    clearInterval(timerInterval);

    showFeedback(
        false,
        "Atenção!",
        `Quem deveria resolver isso é o ${formatRole(currentCall.role)}.`
    );
}

// ===== Final do Jogo =====
function endGame() {

    const reportData = {
        score,
        totalAnswered,
        correctAnswers,
        levelName: config.levelName
    };

    localStorage.setItem("reportData", JSON.stringify(reportData));

    window.location.href = "../report/index.html";
}

// ===== Modal =====
function showFeedback(isCorrect, title, message) {
    const modal = document.getElementById("feedbackModal");
    const content = modal.querySelector(".modal-content");

    document.getElementById("feedbackTitle").textContent = title;
    document.getElementById("feedbackMessage").textContent = message;

    content.classList.remove("success", "error");

    if (isCorrect) {
        content.classList.add("success");
    } else {
        content.classList.add("error");
    }

    modal.classList.remove("hidden");
}

// ===== Botão Continuar =====
const continueBtn = document.getElementById("continueBtn");

if (continueBtn) {
    continueBtn.addEventListener("click", () => {
        document.getElementById("feedbackModal").classList.add("hidden");

        if (lives <= 0 || remainingCalls <= 0) {
            endGame();
        } else {
            loadCall();
        }
    });
}

// ===== Drag & Drop =====
document.querySelectorAll(".drop-zone").forEach(zone => {

    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    zone.addEventListener("drop", () => {
        if (!currentCall) return;

        const selectedRole = zone.dataset.role;

        if (selectedRole === currentCall.role) {
            handleCorrect();
        } else {
            handleWrong();
        }
    });
});

// ===== Util =====
function formatRole(role) {
    const roles = {
        frontend: "Frontend",
        backend: "Backend",
        devops: "DevOps",
        ux: "UX/UI",
        qa: "QA",
        data: "Dados"
    };
    return roles[role];
}

// ===== Inicialização =====
loadCall();
updateHUD();