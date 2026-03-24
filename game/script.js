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
    { text: "O botão não está alinhado corretamente.", role: "frontend", reason: "Alinhamento de elementos visuais é responsabilidade do Frontend, que cuida da interface e experiência visual." },
    { text: "A API está retornando erro 500.", role: "backend", reason: "Erro 500 indica falha no servidor. O Backend é responsável pela lógica de negócio e pelo funcionamento das APIs." },
    { text: "Pipeline de deploy falhou.", role: "devops", reason: "Pipelines de CI/CD são gerenciados pelo DevOps, que cuida da infraestrutura e automação de entregas." },
    { text: "Usuários estão confusos com o layout.", role: "ux", reason: "Problemas de usabilidade e clareza da interface são resolvidos pelo UX/UI, especialista em experiência do usuário." },
    { text: "Bug crítico encontrado em produção.", role: "qa", reason: "O QA é responsável por garantir a qualidade do software, investigando e documentando bugs encontrados." },
    { text: "Consulta ao banco está lenta.", role: "data", reason: "Otimização de queries e desempenho de banco de dados é responsabilidade da área de Dados." },
    { text: "A página não está responsiva no mobile.", role: "frontend", reason: "Responsividade e adaptação do layout para diferentes telas é tarefa do Frontend." },
    { text: "O formulário não dispara a validação corretamente.", role: "frontend", reason: "Validações de formulários no cliente são implementadas pelo Frontend." },
    { text: "Erro de autenticação ao gerar o token JWT.", role: "backend", reason: "JWT e autenticação são processados no servidor, sendo responsabilidade do Backend." },
    { text: "Endpoint está retornando dados inconsistentes.", role: "backend", reason: "A integridade dos dados retornados por endpoints é responsabilidade do Backend." },
    { text: "Servidor caiu após atualização.", role: "devops", reason: "Estabilidade de servidores e deploys seguros são gerenciados pelo DevOps." },
    { text: "Problema na configuração do ambiente de produção.", role: "devops", reason: "Configuração de ambientes (dev, staging, produção) é responsabilidade do DevOps." },
    { text: "Fluxo de cadastro está confuso.", role: "ux", reason: "Fluxos de navegação e experiência do usuário são analisados e corrigidos pelo UX/UI." },
    { text: "Ícones não deixam claro sua funcionalidade.", role: "ux", reason: "Clareza visual e comunicação dos elementos de interface são responsabilidade do UX/UI." },
    { text: "Funcionalidade quebrou após nova release.", role: "qa", reason: "Testes de regressão para garantir que novas releases não quebrem funcionalidades são responsabilidade do QA." },
    { text: "Erro intermitente ao finalizar pedido.", role: "qa", reason: "Identificar e reproduzir erros intermitentes para reportar ao time correto é função do QA." },
    { text: "Relatório está apresentando dados duplicados.", role: "data", reason: "Duplicidade e consistência de dados em relatórios é investigada pela área de Dados." },
    { text: "Índice do banco não está sendo utilizado na consulta.", role: "data", reason: "Otimização de índices e performance de consultas SQL é responsabilidade da área de Dados." }
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

    const currentCallNumber = config.totalCalls - remainingCalls;
    document.getElementById("callProgress").textContent = `${currentCallNumber} de ${config.totalCalls}`;

    const pct = (timeLeft / config.timePerCall) * 100;
    const bar = document.getElementById("timerBar");
    bar.style.width = pct + "%";
    if (pct > 60) {
        bar.style.backgroundColor = "#22c55e";
    } else if (pct > 30) {
        bar.style.backgroundColor = "#eab308";
    } else {
        bar.style.backgroundColor = "#ef4444";
    }
}

// ===== Timer =====
function startTimer() {
    timeLeft = config.timePerCall;

    const bar = document.getElementById("timerBar");
    bar.style.transition = "none";
    bar.style.width = "100%";
    bar.style.backgroundColor = "#22c55e";
    bar.offsetHeight; // força reflow para a transição ser aplicada nos ticks seguintes
    bar.style.transition = "";

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
    document.getElementById("feedbackReason").textContent = currentCall.reason;

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