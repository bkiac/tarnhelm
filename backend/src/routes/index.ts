import express from 'express';

import storage from './storage';

const router = express.Router();

router.get('/ping', (req, res) => res.send('OK'));

router.use('/', storage);

export default router;
