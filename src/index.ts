import express from 'express';
import connectDB from './db';
import userRoutes from "./routes/userRoutes"
import gameRoutes from "./routes/gameRoutes"
import performanceRoutes from "./routes/performanceRoutes"
import loginRoutes from "./routes/loginRoutes"
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { setupSockets } from './sockets';

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

const roleSelections: Record<string, {
  blue: string[];
  red: string[];
}> = {};

setupSockets(io);

// io.on('connection', (socket) => {
//     console.log('Client connecté :', socket.id);
  
//     socket.on('message', (data) => {
//       console.log('Message reçu :', data);
//       io.emit('message', `Serveur a reçu : ${data}`);
//     });
//     ////Communication sur le choix du rôle 
//     socket.on('role', (data) => {
//       console.log('Role sélectionné :', data);
//       io.emit('role', data);
//     });

//     socket.on('role_selection', (data: {
//       team: 'blue' | 'red';
//       role: string;
//       action: 'select' | 'deselect';
//       socketId: string; // Ajoute l'ID du socket pour mieux gérer les déconnexions
//     }) => {
//       const roomId = 'default_room';
//       if (!roleSelections[roomId]) {
//         roleSelections[roomId] = { blue: [], red: [] };
//       }
    
//       const teamRoles = roleSelections[roomId][data.team];
      
//       if (data.action === 'select') {
//         // Retire d'abord le rôle de toutes les équipes (pour éviter les doublons)
//         roleSelections[roomId].blue = roleSelections[roomId].blue.filter(r => r !== data.role);
//         roleSelections[roomId].red = roleSelections[roomId].red.filter(r => r !== data.role);
        
//         // Ajoute le rôle à l'équipe sélectionnée
//         if (!teamRoles.includes(data.role)) {
//           teamRoles.push(data.role);
//         }
//       } else {
//         roleSelections[roomId][data.team] = teamRoles.filter(r => r !== data.role);
//       }
    
//       io.emit('roles_update', roleSelections[roomId]);
//     });
    
//     // Gestion des déconnexions
//     socket.on('disconnect', () => {
//       // Tu pourrais ici nettoyer les rôles sélectionnés par ce socket
//       console.log('Client déconnecté :', socket.id);
//     });
// });
// setupLobbySockets(io);
 
server.listen(PORT, () => {
    console.log(`Serveur intialisé sur http://localhost:${PORT}`);
});