import { useReducer, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import { allCalls } from '../data/calls.js';
import HUD from '../components/HUD.jsx';
import TimerBar from '../components/TimerBar.jsx';
import CallCard from '../components/CallCard.jsx';
import DropZone from '../components/DropZone.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';

const roleLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    ux: 'UX/UI',
    qa: 'QA',
    data: 'Dados',
};

const dropZones = [
    { role: 'frontend', label: 'Frontend' },
    { role: 'backend',  label: 'Backend'  },
    { role: 'devops',   label: 'DevOps'   },
    { role: 'ux',       label: 'UX/UI'    },
    { role: 'qa',       label: 'QA'       },
    { role: 'data',     label: 'Dados'    },
];

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function buildInitialState(config) {
    return {
        score: 0,
        lives: config.lives,
        remainingCalls: config.totalCalls,
        timeLeft: config.timePerCall,
        currentCall: null,
        shuffledCalls: shuffle(allCalls),
        callIndex: 0,
        feedback: null,       // { isCorrect, title, message, reason }
        gameOver: false,
        resetSignal: 0,       // incrementado a cada novo chamado para resetar TimerBar
    };
}

function reducer(state, action) {
    switch (action.type) {
        case 'LOAD_CALL': {
            let { shuffledCalls, callIndex } = state;
            if (callIndex >= shuffledCalls.length) {
                shuffledCalls = shuffle(allCalls);
                callIndex = 0;
            }
            const currentCall = shuffledCalls[callIndex];
            return {
                ...state,
                currentCall,
                shuffledCalls,
                callIndex: callIndex + 1,
                remainingCalls: state.remainingCalls - 1,
                timeLeft: action.timePerCall,
                feedback: null,
                resetSignal: state.resetSignal + 1,
            };
        }
        case 'TICK':
            return { ...state, timeLeft: state.timeLeft - 1 };
        case 'CORRECT_ANSWER':
            return {
                ...state,
                score: state.score + 100,
                feedback: {
                    isCorrect: true,
                    title: 'Boa decisão!',
                    message: `O ${roleLabels[state.currentCall.role]} é responsável por esse tipo de chamado.`,
                    reason: state.currentCall.reason,
                },
            };
        case 'WRONG_ANSWER':
            return {
                ...state,
                lives: state.lives - 1,
                feedback: {
                    isCorrect: false,
                    title: 'Atenção!',
                    message: `Quem deveria resolver isso é o ${roleLabels[state.currentCall.role]}.`,
                    reason: state.currentCall.reason,
                },
            };
        case 'CLOSE_FEEDBACK':
            return { ...state, feedback: null };
        case 'END_GAME':
            return { ...state, gameOver: true };
        default:
            return state;
    }
}

export default function Game() {
    const { gameConfig, setReportData, addRankingEntry, playerName } = useGame();
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(reducer, gameConfig, buildInitialState);
    const timerRef = useRef(null);
    const callCardRef = useRef(null);
    const touchCloneRef = useRef(null);

    const { score, lives, remainingCalls, timeLeft, currentCall, feedback, gameOver, resetSignal } = state;

    // Carrega primeiro chamado
    useEffect(() => {
        dispatch({ type: 'LOAD_CALL', timePerCall: gameConfig.timePerCall });
    }, [gameConfig.timePerCall]);

    // Timer
    useEffect(() => {
        if (!currentCall || feedback || gameOver) return;
        timerRef.current = setInterval(() => {
            dispatch({ type: 'TICK' });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentCall, feedback, gameOver, resetSignal]);

    // Timeout
    useEffect(() => {
        if (timeLeft <= 0 && currentCall && !feedback) {
            clearInterval(timerRef.current);
            dispatch({ type: 'WRONG_ANSWER' });
        }
    }, [timeLeft, currentCall, feedback]);

    // Fim de jogo
    useEffect(() => {
        if (gameOver) return;
        if (lives <= 0 || (remainingCalls <= 0 && !feedback && !currentCall)) {
            dispatch({ type: 'END_GAME' });
        }
    }, [lives, remainingCalls, feedback, currentCall, gameOver]);

    useEffect(() => {
        if (!gameOver) return;
        const totalAnswered = gameConfig.totalCalls - remainingCalls;
        const correctAnswers = score / 100;
        const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
        const data = { score, totalAnswered, correctAnswers, levelName: gameConfig.levelName };
        setReportData(data);
        addRankingEntry({
            name: playerName || 'Anônimo',
            score,
            levelName: gameConfig.levelName,
            accuracy,
            date: new Date().toLocaleDateString('pt-BR'),
        });
        navigate('/report');
    }, [gameOver]);

    // Resposta via drop
    const handleDrop = useCallback((role) => {
        if (!currentCall || feedback) return;
        clearInterval(timerRef.current);
        if (role === currentCall.role) {
            dispatch({ type: 'CORRECT_ANSWER' });
        } else {
            dispatch({ type: 'WRONG_ANSWER' });
        }
    }, [currentCall, feedback]);

    // Continuar após feedback
    function handleContinue() {
        const afterLives = feedback?.isCorrect ? lives : lives - 0; // já decrementado no reducer
        if (lives <= 0 || remainingCalls <= 0) {
            dispatch({ type: 'END_GAME' });
        } else {
            dispatch({ type: 'LOAD_CALL', timePerCall: gameConfig.timePerCall });
        }
    }

    // Touch support
    useEffect(() => {
        const card = callCardRef.current;
        if (!card || !currentCall) return;

        let offsetX = 0;
        let offsetY = 0;

        function onTouchStart(e) {
            if (!currentCall) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;

            const clone = card.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.width = rect.width + 'px';
            clone.style.zIndex = '9999';
            clone.style.opacity = '0.85';
            clone.style.pointerEvents = 'none';
            clone.style.margin = '0';
            clone.style.left = (touch.clientX - offsetX) + 'px';
            clone.style.top = (touch.clientY - offsetY) + 'px';
            document.body.appendChild(clone);
            touchCloneRef.current = clone;
        }

        function onTouchMove(e) {
            if (!touchCloneRef.current) return;
            e.preventDefault();
            const touch = e.touches[0];
            touchCloneRef.current.style.left = (touch.clientX - offsetX) + 'px';
            touchCloneRef.current.style.top = (touch.clientY - offsetY) + 'px';

            document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
            touchCloneRef.current.style.display = 'none';
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            touchCloneRef.current.style.display = '';
            const zone = el?.closest('.drop-zone');
            if (zone) zone.classList.add('drag-over');
        }

        function onTouchEnd(e) {
            if (!touchCloneRef.current) return;
            const touch = e.changedTouches[0];
            document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
            touchCloneRef.current.style.display = 'none';
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            touchCloneRef.current.remove();
            touchCloneRef.current = null;

            const zone = el?.closest('.drop-zone');
            if (zone) handleDrop(zone.dataset.role);
        }

        card.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);

        return () => {
            card.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, [currentCall, handleDrop]);

    if (!currentCall) return null;

    const callNumber = gameConfig.totalCalls - remainingCalls;

    return (
        <main className="game-container">
            <HUD
                levelName={gameConfig.levelName}
                callProgress={`${callNumber} de ${gameConfig.totalCalls}`}
                timeLeft={timeLeft}
                score={score}
                lives={lives}
            />

            <TimerBar
                timeLeft={timeLeft}
                totalTime={gameConfig.timePerCall}
                resetSignal={resetSignal}
            />

            <section className="call-area">
                <CallCard ref={callCardRef} text={currentCall.text} />
            </section>

            <section className="team-area">
                {dropZones.map(({ role, label }) => (
                    <DropZone key={role} role={role} label={label} onDrop={handleDrop} />
                ))}
            </section>

            {feedback && (
                <FeedbackModal
                    visible={true}
                    isCorrect={feedback.isCorrect}
                    title={feedback.title}
                    message={feedback.message}
                    reason={feedback.reason}
                    onContinue={handleContinue}
                />
            )}
        </main>
    );
}
