import { useState } from 'react';

export default function DropZone({ role, label, onDrop }) {
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div
            className={`drop-zone${isDragOver ? ' drag-over' : ''}`}
            data-role={role}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={() => { setIsDragOver(false); onDrop(role); }}
        >
            {label}
        </div>
    );
}
