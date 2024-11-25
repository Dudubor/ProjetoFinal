import User from '../models/userModel'; // Importando o modelo User
import { userSchema } from '../validators/userValidation'; // Importando o schema de validação
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Função para criar um novo usuário
export const createUserService = async (userData: any) => {

    const { name, email, password } = userData;

    const newUser = new User({ name, email, password });

    const user = await newUser.save();
    
    return user
};

// Função para obter todos os usuários
export const getAllUsers = async () => {
    const user = await User.find();
    return user
};

// Função para obter um usuário por ID
export const getUserById = async (userId: string) => {
    const user = await User.findById(userId)
    return user
};

// Função para atualizar um usuário
export const updateUserService = async (userId: string, userData: any) => {
    const validatedData = userSchema.parse(userData);
    let { name, email, password } = validatedData;
  
    return await User.findByIdAndUpdate(
        userId,
        { name, email, password },
        { new: true, runValidators: true }
    );
};

// Função para deletar um usuário
export const deleteUserById = async (userId: string) => {
    return await User.findByIdAndDelete(userId);
};