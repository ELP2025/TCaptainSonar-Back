import express from 'express';
import Performance from '../models/Performance';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { player, game, score, role } = req.body;      
        console.log(player);
        const performance = new Performance({player, game, score, role });
        await performance.save();
        res.status(201).json({ message: 'Performance créé avec succès', performance });
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
});

router.get('/', async (req, res) => {
  try {
      const performances = await Performance.find();
      res.json(performances);
  } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id).populate("player game");
    res.json(performance);
  } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({ error: "L'ID de l'utilisateur est requis" });
      return;
    }

    const performances = await Performance.find({ player: userId }).populate('game');
    
    // Toujours retourner un tableau, même vide
     res.json(performances || []); // ← Modification clé ici
     return
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    return;
  }
});

router.put('/:id', async (req, res) => {
  try {
      const updatedPerformance = await Performance.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: true }
      );

      res.json({ message: "Performance mise à jour avec succès", performance: updatedPerformance });
  } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      await Performance.findByIdAndDelete(req.params.id);
      res.json({ message: "Performance supprimée avec succès" });
  } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
  }
});

export default router;