import { Server, Socket } from 'socket.io';
import { RoleService } from '../services/roleService';
import { RoleSelectionEvent, TeamType, TeamUpdate } from './types';

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

    socket.on('game_start_signal', (data: TeamUpdate) => {
      console.log("Partie lancée !!");
      io.emit('game_start', data); 
    });

    socket.on("getRole", () => {
      const updatedRoles = roleService.getRoomRoles("default_room");
      console.log(updatedRoles)
      io.emit('teams_update', updatedRoles); // Émission à toute la room
    })
  });


};