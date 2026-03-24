const rankings = JSON.parse(localStorage.getItem("rankings") || "[]");
const tbody = document.getElementById("rankingBody");
const emptyMsg = document.getElementById("emptyMsg");

if (rankings.length === 0) {
    emptyMsg.classList.remove("hidden");
} else {
    rankings.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.classList.add(`rank-${index + 1}`);
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.levelName}</td>
            <td>${entry.accuracy}%</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById("playBtn").addEventListener("click", () => {
    window.location.href = "../select-dificult/index.html";
});

document.getElementById("clearBtn").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar o ranking?")) {
        localStorage.removeItem("rankings");
        window.location.reload();
    }
});

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "../main-menu/index.html";
});
