import { Router } from 'express';
import User from '../models/userModel';
import { statusCode } from '../utils/statusCode';
import * as userController from '../controllers/userController';

const router = Router();

// Cadastrar usuários
router.post('/users', userController.createUser);

// Listar todos os usuários
router.get('/users', userController.getAllUsers);

// Retornar dados de um usuário em específico
router.get('/users/:id', userController.getUserById);

// Atualizar um usuário pelo ID
router.put('/users/:id', userController.updateUser);
   
export default router;
