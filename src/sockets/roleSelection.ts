import { Server, Socket } from 'socket.io';
import { RoleService } from '../services/roleService';
import { RoleSelectionEvent } from './types';

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
      io.emit('roles_update', updatedRoles);
      console.log('Envoi roles_update:', updatedRoles); // Debug backend
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté :', socket.id);

      roleService.cleanupOnDisconnect(socket.id);
      const updatedRoles = roleService.getRoomRoles("default_room");
      io.emit('roles_update', updatedRoles); // Émission à toute la room
    });

    socket.on("getRole", () => {
      const updatedRoles = roleService.getRoomRoles("default_room");
      console.log(updatedRoles)
      io.emit('roles_update', updatedRoles); // Émission à toute la room
    })
  });


};