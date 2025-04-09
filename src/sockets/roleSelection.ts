import { Server, Socket } from 'socket.io';
import { RoleService } from '../services/roleService';
import { RoleSelectionEvent, TeamType, TeamUpdate } from './types';
import Game from '../models/Game';

export const setupRoleSockets = (io: Server, roleService: RoleService) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connecté :', socket.id);

    socket.on('role_selection', (data: Omit<RoleSelectionEvent, 'socketId'>) => {
      
      const roomId = socket.data.roomId || 'default_room';
      const eventData: RoleSelectionEvent = {
        ...data,
        socketId: socket.id
      };
      const updatedRoles = roleService.handleRoleSelection(roomId, eventData);
      console.log("UPDATED ROLE", updatedRoles)
      io.emit('teams_update', updatedRoles);
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté :', socket.id);

      roleService.cleanupOnDisconnect(socket.id);
      const updatedRoles = roleService.getRoomRoles("default_room");
      io.emit('teams_update', updatedRoles); // Émission à toute la room
    });

    socket.on('game_start_signal', async (data: TeamUpdate) => {
      console.log("Reçu demande de démarrage de partie");
      
      try {
        // Création de la partie avec le modèle minimal
        const newGame = new Game({
          startDate: new Date(),
          status: 'ongoing'
        });
    
        const savedGame = await newGame.save();
        
        console.log(`Partie créée en base (ID: ${savedGame._id})`);
          io.emit('game_start', { 
          gameId: savedGame._id,
          teams: data // On envoie les données des équipes séparément
        });
        
    
      } catch (error) {
        console.error("Erreur création de partie:", error);
        socket.emit('game_error', {
          message: "Échec du démarrage",
          error: error
        });
      }
    });

    socket.on("getRole", () => {
      const updatedRoles = roleService.getRoomRoles("default_room");
      console.log(updatedRoles)
      io.emit('teams_update', updatedRoles); // Émission à toute la room
    })
  });


};