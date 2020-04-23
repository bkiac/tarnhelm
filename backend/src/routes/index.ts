import express from 'express';

import storage from './storage';

const router = express.Router();
router.use('/', storage);

export default router;
