import { Server } from 'socket.io';
import { setupRoleSockets } from './roleSelection';
import { RoleService } from '../services/roleService';

export const setupSockets = (io: Server) => {
  const roleService = new RoleService();
  
  // Setup des différents gestionnaires
  setupRoleSockets(io, roleService);
  
  // Tu peux ajouter d'autres setup ici plus tard
  // setupChatSockets(io, chatService);
};