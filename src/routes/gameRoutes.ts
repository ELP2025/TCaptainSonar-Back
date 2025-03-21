import express from 'express';
import Game from '../models/Game';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { startDate, endDate, status } = req.body;

        const game = new Game({ startDate, endDate, status });
        await game.save();

        res.status(201).json({ message: 'Partie créé avec succès', game });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
});


export default router;