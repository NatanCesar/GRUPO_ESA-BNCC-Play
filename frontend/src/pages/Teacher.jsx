import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { connectToSession, disconnectSocket, getSocket } from '../services/socket.js';

const DIFFICULTIES = [
    { key: 'junior', label: 'Júnior',  desc: '5 chamados · 30s · 5 vidas' },
    { key: 'pleno',  label: 'Pleno',   desc: '8 chamados · 20s · 3 vidas' },
    { key: 'senior', label: 'Sênior',  desc: '12 chamados · 15s · 2 vidas' },
];

const roleLabels = {
    frontend: 'Frontend', backend: 'Backend', devops: 'DevOps',
    ux: 'UX/UI', qa: 'QA', data: 'Dados',
};

export default function Teacher() {
    const [view, setView]             = useState('home');   // home | lobby | playing | report
    const [difficulty, setDifficulty] = useState('junior');
    const [session, setSession]       = useState(null);     // { code, sessionId, ... }
    const [players, setPlayers]       = useState([]);
    const [rankings, setRankings]     = useState([]);
    const [report, setReport]         = useState(null);
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);

    // Socket listeners ao entrar no lobby
    useEffect(() => {
        if (view !== 'lobby' && view !== 'playing') return;
        const socket = getSocket();

        socket.on('session:player_joined', ({ player }) => {
            setPlayers(prev => prev.find(p => p.id === player.id) ? prev : [...prev, player]);
        });
        socket.on('session:player_left', ({ playerId }) => {
            setPlayers(prev => prev.filter(p => p.id !== playerId));
        });
        socket.on('session:ranking_updated', ({ rankings }) => setRankings(rankings));
        socket.on('session:player_finished', () => {});
        socket.on('session:all_finished', ({ rankings }) => {
            setRankings(rankings);
            loadReport();
        });

        return () => {
            socket.off('session:player_joined');
            socket.off('session:player_left');
            socket.off('session:ranking_updated');
            socket.off('session:player_finished');
            socket.off('session:all_finished');
        };
    }, [view]);

    async function handleCreate() {
        setError('');
        setLoading(true);
        try {
            const data = await api.createSession(difficulty);
            setSession(data);
            setPlayers([]);
            connectToSession(data.code, null, 'teacher');
            setView('lobby');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleStart() {
        setError('');
        setLoading(true);
        try {
            await api.startSession(session.code);
            setView('playing');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleEnd() {
        await api.endSession(session.code).catch(() => {});
        await loadReport();
    }

    async function loadReport() {
        try {
            const data = await api.getReport(session.code);
            setReport(data);
            setView('report');
        } catch {}
    }

    function handleReset() {
        disconnectSocket();
        setSession(null);
        setPlayers([]);
        setRankings([]);
        setReport(null);
        setView('home');
    }

    // ── Views ──────────────────────────────────────────────────────────

    if (view === 'home') return (
        <div className="menu-page">
            <div className="menu-container" style={{ maxWidth: '480px' }}>
                <h1 className="page-title">Painel do Professor</h1>

                {error && <p className="error-msg">{error}</p>}

                <p style={{ color: '#94a3b8', marginBottom: '12px' }}>Selecione a dificuldade:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {DIFFICULTIES.map(d => (
                        <label key={d.key} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: difficulty === d.key ? 'rgba(56,189,248,0.12)' : 'rgba(15,23,42,0.5)',
                            border: `2px solid ${difficulty === d.key ? '#38bdf8' : '#334155'}`,
                            borderRadius: '8px', padding: '12px 16px', cursor: 'pointer',
                        }}>
                            <input type="radio" name="diff" value={d.key}
                                checked={difficulty === d.key}
                                onChange={() => setDifficulty(d.key)}
                                style={{ accentColor: '#38bdf8' }}
                            />
                            <div>
                                <strong>{d.label}</strong>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginLeft: '8px' }}>{d.desc}</span>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="button-group">
                    <button className="btn primary" onClick={handleCreate} disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Sessão'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (view === 'lobby') return (
        <div className="menu-page">
            <div className="menu-container" style={{ maxWidth: '540px' }}>
                <h1 className="page-title">Sala de Espera</h1>
                <p style={{ color: '#94a3b8', marginBottom: '4px' }}>Código para os alunos:</p>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '0.35em', color: '#38bdf8', marginBottom: '8px' }}>
                    {session.code}
                </p>
                <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '24px' }}>
                    {session.levelName} · {session.totalCalls} chamados · {session.timePerCall}s · {session.lives} vidas
                </p>

                {error && <p className="error-msg">{error}</p>}

                <div style={{ textAlign: 'left', width: '100%', marginBottom: '24px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Alunos conectados ({players.length}):
                    </p>
                    {players.length === 0
                        ? <p style={{ color: '#475569' }}>Aguardando alunos...</p>
                        : <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {players.map(p => (
                                <li key={p.id} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px' }}>
                                    {p.name}
                                </li>
                            ))}
                        </ul>
                    }
                </div>

                <div className="button-group">
                    <button className="btn primary" onClick={handleStart} disabled={loading || players.length === 0}>
                        {loading ? 'Iniciando...' : `Iniciar Jogo (${players.length} aluno${players.length !== 1 ? 's' : ''})`}
                    </button>
                </div>
            </div>
        </div>
    );

    if (view === 'playing') return (
        <main className="report-container">
            <h1>Acompanhamento ao Vivo</h1>
            <p className="subtitle" style={{ color: '#38bdf8' }}>⏳ Jogo em andamento</p>

            <div className="report-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(15,23,42,0.8)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px' }}>#</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Aluno</th>
                            <th style={{ padding: '12px' }}>Pts</th>
                            <th style={{ padding: '12px' }}>%</th>
                            <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map(r => (
                            <tr key={r.playerId} style={{ borderTop: '1px solid #1e293b' }}>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.position}</td>
                                <td style={{ padding: '12px' }}>{r.name}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.score}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{r.accuracy}%</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {r.status === 'FINISHED' ? '✅' : '🎮'}
                                </td>
                            </tr>
                        ))}
                        {rankings.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#475569' }}>Aguardando respostas...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="button-group">
                <button className="btn secondary" onClick={handleEnd}>Encerrar Sessão</button>
            </div>
        </main>
    );

    if (view === 'report' && report) return (
        <main className="report-container">
            <h1>Relatório da Turma</h1>
            <p className="subtitle">{report.levelName} · {report.totalPlayers} aluno{report.totalPlayers !== 1 ? 's' : ''}</p>

            <div className="report-card" style={{ marginBottom: '16px' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Média da turma</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{report.classAverage.score} pts · {report.classAverage.accuracy}%</p>
            </div>

            {report.players.map((p, i) => (
                <div key={i} className="report-card" style={{ marginBottom: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <strong>{p.name}</strong>
                        <span style={{ color: '#38bdf8' }}>{p.score} pts · {p.accuracy}%</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                        {Object.entries(p.byCategory).map(([role, stats]) => (
                            <div key={role} style={{
                                background: 'rgba(15,23,42,0.6)',
                                borderRadius: '6px',
                                padding: '8px',
                                textAlign: 'center',
                                border: `1px solid ${stats.total === 0 ? '#1e293b' : stats.correct === stats.total ? '#22c55e33' : '#ef444433'}`,
                            }}>
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{roleLabels[role]}</p>
                                <p style={{ fontWeight: 'bold', color: stats.total === 0 ? '#475569' : stats.correct === stats.total ? '#22c55e' : '#ef4444' }}>
                                    {stats.correct}/{stats.total}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="button-group" style={{ marginTop: '24px' }}>
                <button className="btn primary" onClick={handleReset}>Nova Sessão</button>
            </div>
        </main>
    );

    return null;
}
