import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
