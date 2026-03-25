export function registerSocketHandlers(io) {
    io.on('connection', (socket) => {

        socket.on('session:join', ({ code, playerId, role }) => {
            socket.join(code);
            socket.data = { code, playerId, role };
        });

        socket.on('disconnecting', async () => {
            const { code, playerId, role } = socket.data || {};
            if (!code || role !== 'player' || !playerId) return;

            // Notifica apenas se o jogador ainda estava em WAITING (não começou)
            try {
                const { default: prisma } = await import('../lib/prisma.js');
                const player = await prisma.player.findUnique({ where: { id: playerId } });
                if (player?.status === 'WAITING') {
                    io.to(code).emit('session:player_left', { playerId, name: player.name });
                }
            } catch {
                // silencioso — player pode não existir se desconectou antes do join REST
            }
        });
    });
}
