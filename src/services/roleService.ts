import { RoomRoles, TeamType } from '../sockets/types';

export class RoleService {
  private roleSelections: RoomRoles = {};
  private playerRoles: Record<string, { 
    roomId: string; 
    team: TeamType; 
    role: string;
    playerId: string;
  }[]> = {};

  handleRoleSelection(roomId: string, data: {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
    playerId: string;
    socketId: string;
  }): RoomRoles[string] {
    console.log(data);
    
    // Initialise la structure de la room si elle n'existe pas
    if (!this.roleSelections[roomId]) {
      this.roleSelections[roomId] = { 
        blue: { captain: '' }, 
        red: { captain: '' } 
      };
    }

    const room = this.roleSelections[roomId];

    if (data.action === 'select') {
      // Gestion spécifique pour le rôle de capitaine
      if (data.role === 'Capitaine') {
        // Désélectionne l'ancien capitaine s'il y en avait un
        if (room[data.team].captain) {
          this.cleanupPlayerRole(room[data.team].captain, roomId, data.team, 'Capitaine');
        }
        
        // Assigner le nouveau capitaine
        room[data.team].captain = data.playerId;
        
        // Enregistrer le rôle du joueur
        if (!this.playerRoles[data.socketId]) {
          this.playerRoles[data.socketId] = [];
        }
        this.playerRoles[data.socketId].push({ 
          roomId, 
          team: data.team, 
          role: data.role,
          playerId: data.playerId
        });
      }
      // Vous pouvez ajouter la gestion d'autres rôles ici si nécessaire
    } else {
      // Désélection
      if (data.role === 'Capitaine' && room[data.team].captain === data.playerId) {
        room[data.team].captain = '';
        this.cleanupPlayerRole(data.playerId, roomId, data.team, 'Capitaine');
      }
      // Gestion d'autres rôles si nécessaire
    }

    return this.getRoomRoles(roomId);
  }

  private cleanupPlayerRole(playerId: string, roomId: string, team: TeamType, role: string) {
    // Nettoie les références dans playerRoles
    for (const socketId in this.playerRoles) {
      this.playerRoles[socketId] = this.playerRoles[socketId].filter(
        r => !(r.playerId === playerId && 
              r.roomId === roomId && 
              r.team === team && 
              r.role === role)
      );
      
      if (this.playerRoles[socketId].length === 0) {
        delete this.playerRoles[socketId];
      }
    }
  }

  getRoomRoles(roomId: string): RoomRoles[string] {
    return this.roleSelections[roomId] || { 
      blue: { captain: '' }, 
      red: { captain: '' } 
    };
  }

  cleanupOnDisconnect(socketId: string) {
    if (!this.playerRoles[socketId]) return;

    this.playerRoles[socketId].forEach(({ roomId, team, role, playerId }) => {
      const room = this.roleSelections[roomId];
      if (room && role === 'Capitaine' && room[team].captain === playerId) {
        room[team].captain = '';
      }
    });

    delete this.playerRoles[socketId];
  }

  // Méthode pour vérifier si un rôle est déjà pris
  isRoleTaken(roomId: string, team: TeamType, role: string): boolean {
    const room = this.roleSelections[roomId];
    if (!room) return false;
    
    if (role === 'Capitaine') {
      return !!room[team].captain;
    }
    
    return false;
  }
}