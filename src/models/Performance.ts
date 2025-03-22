import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true,
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    score: {
        type: Number,
    },
    role: {
        type: String,
        enum: ['Captain', 'First Mate', 'Radio Operator', 'Engineer'], // Limite aux rôles possibles
        required: true,
    }
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
