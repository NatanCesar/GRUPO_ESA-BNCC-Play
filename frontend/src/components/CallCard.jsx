import { forwardRef } from 'react';

const CallCard = forwardRef(function CallCard({ text }, ref) {
    return (
        <div className="call-card" draggable="true" ref={ref} id="callCard">
            <h3>Chamado</h3>
            <p>{text}</p>
        </div>
    );
});

export default CallCard;
