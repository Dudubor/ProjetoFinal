import { Router } from 'express';
import User from '../models/userModel';
import { statusCode } from '../utils/statusCode';

const router = Router();
//Adicionar as rotas de POST, GET, PUT e DELETE

// Listar todos os usuários
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Busca todos os documentos da coleção
        res.status(statusCode.OK).json(users); // Retorna os dados como JSON
    } catch (error) {
        res.status(statusCode.InternalServerError).json({ error: 'Erro ao buscar os usuários.' });
    }
});

// Retornar dados de um usuário em específico
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id; // Pegando o ID da URL

    try {
        // Buscar o usuário no MongoDB
        const user = await User.findById(userId); 

        if (!user) {
            return res.status(statusCode.NotFound).json({ message: 'Usuário não encontrado!' });
        }

        res.status(statusCode.OK).json(user); // Retorna os dados do usuário
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        res.status(statusCode.InternalServerError).json({ error: 'Erro interno do servidor.' });
    }
});

// Cadastrar usuários
router.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body; // Desestrutura os dados do corpo da requisição

        // Cria um novo documento usando o modelo
        const newUser = new User({ name, email, password });

        // Salva o documento no MongoDB
        const savedUser = await newUser.save();

        res.status(statusCode.Created).json(savedUser); // Retorna o usuário criado
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        // Tratamento de erros, como duplicidade de e-mail
        res.status(statusCode.BadRequest).json({ error });
    }
});

export default router;
