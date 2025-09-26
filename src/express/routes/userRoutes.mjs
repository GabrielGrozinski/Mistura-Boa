import express from 'express';
import { GetUsuario, alterar_DiasLogados_e_UltimoLogin, CriarUsuario } from '../controllers/UsersController.mjs';

const router = express.Router();

router.post('/', CriarUsuario);
router.get('/', GetUsuario);
router.patch('/', alterar_DiasLogados_e_UltimoLogin);

export default router;
