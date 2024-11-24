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

// Atualizar um usuário pelo ID
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id; // ID do usuário passado na URL
    const { name, email, password } = req.body; // Dados atualizados no corpo da requisição

    try {
        // Atualizar o usuário no banco de dados
        const updatedUser = await User.findByIdAndUpdate(
            userId,          // ID do documento a ser atualizado
            { name, email, password }, // Dados a serem atualizados
            { new: true, runValidators: true } // Retorna o documento atualizado e valida os dados
        );

        if (!updatedUser) {
            return res.status(statusCode.NotFound).json({ message: 'Usuário não encontrado.' });
        }

        res.status(statusCode.OK).json({ message: 'Usuário atualizado com sucesso!', data: updatedUser });
    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
        res.status(statusCode.InternalServerError).json({ error: 'Erro interno do servidor.' });
    }
});

export default router;
