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


router.put('/:id', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Vérifie si le corps de la requête contient les données nécessaires
        if (!username || !password) {
            res.status(400).json({ error: 'Username et password sont requis' });
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Met à jour l'utilisateur
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { username, password: hashedPassword },
                { new: true } // Retourne l'utilisateur mis à jour
            );

            if (!updatedUser) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            else {
                res.json(updatedUser);
            }
        }
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        else {
            res.json(deletedUser);
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;