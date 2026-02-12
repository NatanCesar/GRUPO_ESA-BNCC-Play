document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("aboutBtn").addEventListener("click", goToAbout);

function startGame() {
    const playerName = document.getElementById("playerName").value.trim();

    if (!playerName) {
        alert("Digite seu nome antes de iniciar.");
        return;
    }

    // Salva o nome no localStorage para usar na tela de jogo
    localStorage.setItem("playerName", playerName);

    window.location.href = "./select-dificult/index.html";
}

function goToAbout() {
    window.location.href = "./about/index.html";
}
