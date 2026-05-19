import { forwardRef } from 'react';

const CallCard = forwardRef(function CallCard({ text }, ref) {
    return (
        <div className="call-card" draggable="true" ref={ref} id="callCard">
            <span className="call-card-label">Chamado Recebido</span>
            <p>{text}</p>
            <span className="call-card-hint">Arraste para a equipe correta</span>
        </div>
    );
});

export default CallCard;
