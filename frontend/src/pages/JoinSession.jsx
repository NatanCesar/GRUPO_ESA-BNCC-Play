import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { api } from '../services/api.js';
import { connectToSession } from '../services/socket.js';

export default function JoinSession() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { setPlayerName, setPlayerId, setSessionCode, setCallIndices,
            setGameConfig, setIsClassMode } = useGame();
    const navigate = useNavigate();

    async function handleJoin() {
        const trimName = name.trim();
        const trimCode = code.trim().toUpperCase();

        if (!trimName) return setError('Digite seu nome.');
        if (!trimCode) return setError('Digite o código da turma.');

        setError('');
        setLoading(true);

        try {
            const data = await api.joinSession(trimCode, trimName);

            setPlayerName(trimName);
            setPlayerId(data.playerId);
            setSessionCode(trimCode);
            setCallIndices(data.callIndices);
            setGameConfig(data.config);
            setIsClassMode(true);

            connectToSession(trimCode, data.playerId, 'player');

            navigate('/lobby');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="menu-page">
            <div className="menu-container">
                <h1 className="page-title">Entrar em Turma</h1>

                {error && <p className="error-msg">{error}</p>}

                <div className="input-group">
                    <label htmlFor="joinName">Seu nome:</label>
                    <input
                        id="joinName"
                        type="text"
                        placeholder="Ex: João"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="sessionCode">Código da turma:</label>
                    <input
                        id="sessionCode"
                        type="text"
                        placeholder="Ex: ABC-123"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleJoin()}
                        maxLength={7}
                        style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}
                    />
                </div>

                <div className="button-group">
                    <button className="btn primary" onClick={handleJoin} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <button className="btn secondary" onClick={() => navigate('/')}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
