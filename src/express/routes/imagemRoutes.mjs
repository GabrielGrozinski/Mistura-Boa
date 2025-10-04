import express from 'express';
import { EnviarImagem, ReceberImagemEscolhida } from '../controllers/ImagensController.mjs';

const router = express.Router();

router.post('/', EnviarImagem);
router.get('/', ReceberImagemEscolhida);

export default router;
