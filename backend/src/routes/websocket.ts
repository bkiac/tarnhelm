import express from 'express';
import expressWs from 'express-ws';

import { upload, reverse } from '../handlers';

const router: expressWs.Router = express.Router();
router.ws('/upload', upload);
router.ws('/reverse', reverse);

export default router;
