import express from 'express';

import websocket from './websocket';

const router = express.Router();
router.use('/ws', websocket);

export default router;
