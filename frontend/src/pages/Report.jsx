import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';

function getClassification(accuracy) {
    if (accuracy >= 90) return 'Você atingiu nível SÊNIOR! 🏆';
    if (accuracy >= 70) return 'Você está no nível PLENO! 👍';
    if (accuracy >= 50) return 'Você é JÚNIOR! 📈';
    return 'Continue praticando, você é o futuro! 💪';
}

export default function Report() {
    const { reportData } = useGame();
    const navigate = useNavigate();

    const { score, totalAnswered, correctAnswers, levelName } = reportData;
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

    return (
        <div className="report-page">
            <div className="report-container">
                <h1>Relatório de Desempenho</h1>
                <p className="subtitle">Resumo da sua gestão</p>

                <div className="report-card">
                    <h2>{getClassification(accuracy)}</h2>
                    <p><strong>Nível jogado:</strong> {levelName}</p>
                    <p><strong>Pontuação Final:</strong> {score}</p>
                    <p><strong>Aproveitamento:</strong> {accuracy}%</p>
                    <p><strong>Chamados Resolvidos:</strong> {correctAnswers} de {totalAnswered}</p>
                </div>

                <div className="button-group">
                    <button className="btn primary" onClick={() => navigate('/select-difficulty')}>
                        Jogar Novamente
                    </button>
                    <button className="btn secondary" onClick={() => navigate('/')}>
                        Voltar ao Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
