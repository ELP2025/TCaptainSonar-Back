import express from 'express';
import connectDB from './db';
import userRoutes from "./routes/userRoutes"
import gameRoutes from "./routes/gameRoutes"
import performanceRoutes from "./routes/performanceRoutes"
import loginRoutes from "./routes/loginRoutes"
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Remplace par l'URL de ton frontend
  credentials: true, // Si tu utilises des cookies ou des headers sécurisés
}));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/', loginRoutes);
connectDB(); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', ///// Attention que le client essaie aussi de se connecter au port 5173
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;


io.on('connection', (socket) => {
    console.log('Client connecté :', socket.id);
  
    socket.on('message', (data) => {
      console.log('Message reçu :', data);
      io.emit('message', `Serveur a reçu : ${data}`);
    });
    ////Communication sur le choix du rôle 
    socket.on('role', (data) => {
      console.log('Role sélectionné :', data);
      io.emit('role', data);
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté :', socket.id);
    });
});
 
server.listen(PORT, () => {
    console.log(`Serveur intialisé sur http://localhost:${PORT}`);
});