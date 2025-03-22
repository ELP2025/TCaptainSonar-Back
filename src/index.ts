import express from 'express';
import connectDB from './db';
import userRoutes from "./routes/userRoutes"
import gameRoutes from "./routes/gameRoutes"
import performanceRoutes from "./routes/performanceRoutes"

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/performances', performanceRoutes);
connectDB(); 
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});
 
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});