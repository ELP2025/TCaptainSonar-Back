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

router.put('/:id', async (req, res) => {
    try {
        const {endDate, status } = req.body;
        if (status && !['ongoing', 'completed'].includes(status)) {
            res.status(400).json({ error: 'le status doit être ongoing ou completed' });
          }
        else {
            const updatedGame = await Game.findByIdAndUpdate(
                req.params.id,
                { endDate, status},
                {new: true}
            )
            if (!updatedGame) {
                res.status(404).json({ error: 'partie non trouvé' });
            }
            else {
                res.json(updatedGame);
            }
        };
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
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