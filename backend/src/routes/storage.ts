import express from 'express';
import expressWs from 'express-ws';

import { storage } from '../handlers';

const router: expressWs.Router = express.Router();
router.ws('/upload', storage.upload);
router.get('/download/:id', storage.download);

export default router;
