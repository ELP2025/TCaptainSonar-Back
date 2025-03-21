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


router.get('/', async (req, res) => {
    try {
        const games = await Game.find({});
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }

});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if(!game) {
            res.status(404).json({error : "partie non trouvée"});
        }
        else {
            res.json(game);
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }

});
export default router;