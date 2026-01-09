import { request, response } from "express";
import { db } from '../db/db.js';
import { users, collections, flashcards } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * @param {request} req 
 * @param {response} res 
 */

export const listUsers = async (req, res) => {
    try {
        const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
        
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé." });
        }

        const usersWithoutPasswords = allUsers.map(({ password, ...rest }) => rest);
        
        res.status(200).json(usersWithoutPasswords);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Échec de la récupération des utilisateurs.",
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.select().from(users).where(eq(users.id, id));

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const { password, ...userWithoutPassword } = user;
        
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Échec de la récupération de l'utilisateur.",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();

        if (!deletedUser) {
            return res.status(500).json({ message: "Échec de la suppression de l'utilisateur." });
        }
        
        res.status(200).json({ message: "Utilisateur et toutes ses données associées supprimés avec succès.", userId: deletedUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Échec de la suppression de l'utilisateur.",
        });
    }
};
