import express from 'express';
import connectDB from './db';

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});