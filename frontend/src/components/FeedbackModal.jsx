export default function FeedbackModal({ visible, isCorrect, title, message, reason, onContinue }) {
    if (!visible) return null;

    return (
        <div className="modal">
            <div className={`modal-content ${isCorrect ? 'success' : 'error'}`}>
                <h2>{title}</h2>
                <p>{message}</p>
                <p className="feedback-reason">{reason}</p>
                <button className="btn small secondary" onClick={onContinue}>
                    Continuar
                </button>
            </div>
        </div>
    );
}
