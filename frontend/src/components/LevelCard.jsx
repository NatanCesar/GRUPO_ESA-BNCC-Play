export default function LevelCard({ title, description, calls, timePerCall, lives, onSelect }) {
    return (
        <div className="level-card">
            <h2>{title}</h2>
            <p>{description}</p>
            <ul>
                <li>📋 {calls} chamados</li>
                <li>⏳ {timePerCall}s por chamado</li>
                <li>❤️ {lives} {lives === 1 ? 'vida' : 'vidas'}</li>
            </ul>
            <button className="btn primary select-btn" onClick={onSelect}>
                Selecionar
            </button>
        </div>
    );
}
