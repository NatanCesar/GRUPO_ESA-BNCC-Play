const levelConfigs = {
    intern: {
        levelName: "Estagiário",
        totalCalls: 5,
        timePerCall: 30,
        lives: 5
    },
    junior: {
        levelName: "Júnior",
        totalCalls: 8,
        timePerCall: 20,
        lives: 3
    },
    senior: {
        levelName: "Sênior",
        totalCalls: 12,
        timePerCall: 15,
        lives: 2
    }
};

document.querySelectorAll(".select-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest(".level-card");
        const levelKey = card.dataset.level;

        const config = levelConfigs[levelKey];

        // Salva configuração no localStorage
        localStorage.setItem("gameConfig", JSON.stringify(config));

        // Redireciona para o jogo
        window.location.href = "../game/index.html";
    });
});

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../main-menu/index.html";
});
