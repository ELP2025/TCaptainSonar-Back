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

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');

        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        else {
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclut les mots de passe
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



export default router;