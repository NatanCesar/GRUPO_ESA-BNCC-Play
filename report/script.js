const reportData = JSON.parse(localStorage.getItem("reportData"));

if (!reportData) {
    window.location.href = "../home/index.html";
}

const { score, totalAnswered, correctAnswers, levelName } = reportData;

const accuracy = totalAnswered > 0
    ? Math.round((correctAnswers / totalAnswered) * 100)
    : 0;

document.getElementById("finalScore").textContent = score;
document.getElementById("accuracy").textContent = accuracy;
document.getElementById("summary").textContent =
    `${correctAnswers} de ${totalAnswered}`;

// Classificação pedagógica
let classificationText;

if (accuracy >= 90) {
    classificationText = "Você atingiu nível SÊNIOR!";
} else if (accuracy >= 70) {
    classificationText = "Você está no nível PLENO!";
} else if (accuracy >= 50) {
    classificationText = "Você é JÚNIOR!";
} else {
    classificationText = "Continue praticando, você é o futuro!";
}

document.getElementById("classification").textContent = classificationText;

document.getElementById("playAgain").addEventListener("click", () => {
    window.location.href = "../game/index.html";
});

document.getElementById("backMenu").addEventListener("click", () => {
    window.location.href = "../main-menu/index.html";
});