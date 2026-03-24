export default function HUD({ levelName, callProgress, timeLeft, score, lives }) {
    return (
        <header className="hud">
            <div>Nível: <strong>{levelName}</strong></div>
            <div>📋 Chamado: <strong>{callProgress}</strong></div>
            <div>⏳ Tempo: <strong>{timeLeft}s</strong></div>
            <div>⭐ Pontos: <strong>{score}</strong></div>
            <div>❤️ Vidas: <strong>{lives}</strong></div>
        </header>
    );
}
