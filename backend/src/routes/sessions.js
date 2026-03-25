import { Router } from 'express';
import {
    createSession,
    getSession,
    joinSession,
    startSession,
    getSessionRanking,
    getSessionReport,
    endSession,
} from '../controllers/sessionController.js';
import { finishPlayer } from '../controllers/playerController.js';

const router = Router();

router.post('/sessions',                   createSession);
router.get('/sessions/:code',              getSession);
router.post('/sessions/:code/join',        joinSession);
router.post('/sessions/:code/start',       startSession);
router.get('/sessions/:code/ranking',      getSessionRanking);
router.get('/sessions/:code/report',       getSessionReport);
router.post('/sessions/:code/end',         endSession);

router.post('/players/:playerId/finish',   finishPlayer);

export default router;
