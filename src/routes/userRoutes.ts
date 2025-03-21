import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès', user });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
});

  
export default router;