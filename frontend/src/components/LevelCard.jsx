export default function LevelCard({ levelKey, title, description, calls, timePerCall, lives, onSelect }) {
    return (
        <div className={`level-card level-card--${levelKey}`}>
            <h2>{title}</h2>
            <p className="level-card-desc">{description}</p>
            <div className="level-stats">
                <div className="level-stat">
                    <span className="stat-value">{calls}</span>
                    <span className="stat-label">chamados</span>
                </div>
                <div className="level-stat">
                    <span className="stat-value">{timePerCall}s</span>
                    <span className="stat-label">por chamado</span>
                </div>
                <div className="level-stat">
                    <span className="stat-value">{lives}</span>
                    <span className="stat-label">{lives === 1 ? 'vida' : 'vidas'}</span>
                </div>
            </div>
            <button className="btn select-btn" onClick={onSelect}>
                Selecionar
            </button>
        </div>
    );
}
