import express from 'express';
import expressWs from 'express-ws';

import { upload } from '../handlers';

const router: expressWs.Router = express.Router();
router.ws('/upload', upload);

export default router;
