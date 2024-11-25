
import { Request, Response } from 'express';
import User from '../models/userModel'; // Importando o modelo User
import { statusCode } from '../utils/statusCode';
import { userSchema } from '../validators/userValidation'; // Importando o schema de validação
import { z } from 'zod';
import bcrypt from  'bcrypt'; 

// Função para criar um novo usuário
export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedData = userSchema.parse(req.body);

        let { name, email, password } = validatedData; // Desestrutura os dados da variavel validada
        
        password = await bcrypt.hash(password, 10); //Criptografa a senha 
        
        // Cria um novo documento usando o modelo
        const newUser = new User({ name, email, password });

        // Salva o documento no MongoDB
        const savedUser = await newUser.save();

        res.status(statusCode.Created).json(savedUser); // Retorna o usuário criado
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(statusCode.BadRequest).json({ errors: error.errors });
        }
        console.error('Erro ao criar usuário:', error);

        // Tratamento de erros, como duplicidade de e-mail
        res.status(statusCode.BadRequest).json({ error });
    }
};

// Função para obter um usuário
export const getAllUsers = async (req: Request, res: Response) => {

    try {
        const users = await User.find(); // Busca todos os documentos da coleção
        if (!users) {
            return res.status(statusCode.NotFound).json({ message: 'Nenhum usuário encontrado.' });
        }
        res.status(statusCode.OK).json(users); // Retorna os dados como JSON
    } catch (error) {
        res.status(statusCode.InternalServerError).json({ error: 'Erro ao buscar os usuários.' });
    }

};

export const getUserById = async (req: Request, res: Response) => {
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
};

// Função para atualizar um usuário
export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id; // Pegando o ID da URL

    try {


        const validatedData = userSchema.parse(req.body);

        let { name, email, password } = validatedData // Dados atualizados validados

        if(password){ 
            password = await bcrypt.hash(password, 10);
        }


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
        if (error instanceof z.ZodError) {
            return res.status(statusCode.BadRequest).json({ errors: error.errors });
        }
        console.error('Erro ao atualizar o usuário:', error);
        res.status(statusCode.InternalServerError).json({ error: 'Erro interno do servidor.' });
    }
};

// Função para deletar um usuário.
export const deleteUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(statusCode.NotFound).json({ message: 'Usuário não encontrado.' });
        }

        await User.findByIdAndDelete(userId);

        return res.status(statusCode.OK).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(statusCode.BadRequest).json({ errors: error.errors });
        }
        console.error('Erro ao deletar o usuário:', error);
        res.status(statusCode.InternalServerError).json({ error: 'Erro interno do servidor.' });
    }
};