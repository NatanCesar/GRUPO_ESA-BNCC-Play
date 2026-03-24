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
const allCalls = [
    { text: "O botão não está alinhado corretamente.", role: "frontend" },
    { text: "A API está retornando erro 500.", role: "backend" },
    { text: "Pipeline de deploy falhou.", role: "devops" },
    { text: "Usuários estão confusos com o layout.", role: "ux" },
    { text: "Bug crítico encontrado em produção.", role: "qa" },
    { text: "Consulta ao banco está lenta.", role: "data" },
    { text: "A página não está responsiva no mobile.", role: "frontend" },
    { text: "O formulário não dispara a validação corretamente.", role: "frontend" },
    { text: "Erro de autenticação ao gerar o token JWT.", role: "backend" },
    { text: "Endpoint está retornando dados inconsistentes.", role: "backend" },
    { text: "Servidor caiu após atualização.", role: "devops" },
    { text: "Problema na configuração do ambiente de produção.", role: "devops" },
    { text: "Fluxo de cadastro está confuso.", role: "ux" },
    { text: "Ícones não deixam claro sua funcionalidade.", role: "ux" },
    { text: "Funcionalidade quebrou após nova release.", role: "qa" },
    { text: "Erro intermitente ao finalizar pedido.", role: "qa" },
    { text: "Relatório está apresentando dados duplicados.", role: "data" },
    { text: "Índice do banco não está sendo utilizado na consulta.", role: "data" }
];

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

let shuffledCalls = shuffle(allCalls);
let callIndex = 0;

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

    if (callIndex >= shuffledCalls.length) {
        shuffledCalls = shuffle(allCalls);
        callIndex = 0;
    }

    currentCall = shuffledCalls[callIndex++];
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

// ===== Drag & Drop (Mouse) =====
document.querySelectorAll(".drop-zone").forEach(zone => {

    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
    });

    zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
    });

    zone.addEventListener("drop", () => {
        zone.classList.remove("drag-over");
        if (!currentCall) return;

        const selectedRole = zone.dataset.role;

        if (selectedRole === currentCall.role) {
            handleCorrect();
        } else {
            handleWrong();
        }
    });
});

// ===== Touch Support =====
const callCard = document.getElementById("callCard");
let touchClone = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

callCard.addEventListener("touchstart", (e) => {
    if (!currentCall) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = callCard.getBoundingClientRect();

    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    touchClone = callCard.cloneNode(true);
    touchClone.style.position = "fixed";
    touchClone.style.width = rect.width + "px";
    touchClone.style.zIndex = "9999";
    touchClone.style.opacity = "0.85";
    touchClone.style.pointerEvents = "none";
    touchClone.style.left = (touch.clientX - touchOffsetX) + "px";
    touchClone.style.top = (touch.clientY - touchOffsetY) + "px";
    touchClone.style.margin = "0";
    touchClone.style.cursor = "grabbing";
    document.body.appendChild(touchClone);
}, { passive: false });

document.addEventListener("touchmove", (e) => {
    if (!touchClone) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - touchOffsetX) + "px";
    touchClone.style.top = (touch.clientY - touchOffsetY) + "px";

    document.querySelectorAll(".drop-zone").forEach(z => z.classList.remove("drag-over"));
    touchClone.style.display = "none";
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    touchClone.style.display = "";
    const zone = el ? el.closest(".drop-zone") : null;
    if (zone) zone.classList.add("drag-over");
}, { passive: false });

document.addEventListener("touchend", (e) => {
    if (!touchClone) return;

    const touch = e.changedTouches[0];
    document.querySelectorAll(".drop-zone").forEach(z => z.classList.remove("drag-over"));

    touchClone.style.display = "none";
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    touchClone.remove();
    touchClone = null;

    if (!currentCall) return;

    const zone = el ? el.closest(".drop-zone") : null;
    if (!zone) return;

    const selectedRole = zone.dataset.role;
    if (selectedRole === currentCall.role) {
        handleCorrect();
    } else {
        handleWrong();
    }
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