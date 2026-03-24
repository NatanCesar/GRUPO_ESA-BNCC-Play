import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import RankingTable from '../components/RankingTable.jsx';

export default function Ranking() {
    const { rankings, clearRankings } = useGame();
    const navigate = useNavigate();

    function handleClear() {
        if (window.confirm('Tem certeza que deseja limpar o ranking?')) {
            clearRankings();
        }
    }

    return (
        <div className="ranking-page">
            <div className="ranking-container">
                <h1>🏆 Ranking</h1>
                <p className="subtitle">Os melhores gestores de TI</p>

                <RankingTable rankings={rankings} />

                <div className="button-group">
                    <button className="btn primary" onClick={() => navigate('/select-difficulty')}>
                        Jogar
                    </button>
                    <button className="btn secondary danger" onClick={handleClear}>
                        Limpar Ranking
                    </button>
                    <button className="btn secondary" onClick={() => navigate('/')}>
                        Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
