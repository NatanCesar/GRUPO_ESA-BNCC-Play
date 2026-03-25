import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { getSocket, disconnectSocket } from '../services/socket.js';
import { api } from '../services/api.js';

const medalColors = { 1: '#fbbf24', 2: '#94a3b8', 3: '#b45309' };

export default function ClassRanking() {
    const { sessionCode, playerId, reportData, resetClassMode } = useGame();
    const navigate = useNavigate();
    const [rankings, setRankings] = useState([]);
    const [allFinished, setAllFinished] = useState(false);

    useEffect(() => {
        if (!sessionCode) {
            navigate('/');
            return;
        }

        // Carrega ranking inicial via REST
        api.getRanking(sessionCode).then(data => setRankings(data.rankings)).catch(() => {});

        const socket = getSocket();

        socket.on('session:ranking_updated', ({ rankings }) => setRankings(rankings));
        socket.on('session:all_finished', ({ rankings }) => {
            setRankings(rankings);
            setAllFinished(true);
        });
        socket.on('session:ended', () => setAllFinished(true));

        return () => {
            socket.off('session:ranking_updated');
            socket.off('session:all_finished');
            socket.off('session:ended');
        };
    }, [sessionCode]);

    function handleLeave() {
        disconnectSocket();
        resetClassMode();
        navigate('/');
    }

    return (
        <main className="report-container">
            <h1>Ranking da Turma</h1>
            <p className="subtitle" style={{ color: '#38bdf8' }}>
                {allFinished ? '🏁 Todos finalizaram!' : '⏳ Atualizando ao vivo...'}
            </p>

            {reportData && (
                <div className="report-card" style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Sua pontuação</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38bdf8' }}>
                        {reportData.score} pts
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {reportData.correctAnswers} de {reportData.totalAnswered} corretos
                    </p>
                </div>
            )}

            <div className="report-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(15,23,42,0.8)', textTransform: 'uppercase', fontSize: '0.75rem', color: '#94a3b8' }}>
                            <th style={{ padding: '12px' }}>#</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Jogador</th>
                            <th style={{ padding: '12px' }}>Pts</th>
                            <th style={{ padding: '12px' }}>%</th>
                            <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map(r => (
                            <tr
                                key={r.playerId}
                                style={{
                                    borderTop: '1px solid #1e293b',
                                    background: r.playerId === playerId ? 'rgba(56,189,248,0.08)' : 'transparent',
                                    color: medalColors[r.position] || 'white',
                                    fontWeight: r.playerId === playerId ? 'bold' : 'normal',
                                }}
                            >
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.position}</td>
                                <td style={{ padding: '12px' }}>
                                    {r.name} {r.playerId === playerId && '(você)'}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.score}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.accuracy}%</td>
                                <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem' }}>
                                    {r.status === 'FINISHED' ? '✅' : '🎮'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {allFinished && (
                <div className="button-group" style={{ marginTop: '24px' }}>
                    <button className="btn primary" onClick={handleLeave}>
                        Voltar ao Menu
                    </button>
                </div>
            )}
        </main>
    );
}
