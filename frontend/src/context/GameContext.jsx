import { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [playerName, setPlayerName] = useState(null);
    const [gameConfig, setGameConfig] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [rankings, setRankings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('rankings') || '[]');
        } catch {
            return [];
        }
    });

    function addRankingEntry(entry) {
        setRankings(prev => {
            const updated = [...prev, entry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            localStorage.setItem('rankings', JSON.stringify(updated));
            return updated;
        });
    }

    function clearRankings() {
        setRankings([]);
        localStorage.removeItem('rankings');
    }

    return (
        <GameContext.Provider value={{
            playerName, setPlayerName,
            gameConfig, setGameConfig,
            reportData, setReportData,
            rankings, addRankingEntry, clearRankings,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
