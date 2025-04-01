import { RoomRoles, TeamType } from '../sockets/types';

export class RoleService {
  private roleSelections: RoomRoles = {};

  handleRoleSelection(roomId: string, data: {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
  }): RoomRoles[string] {
    if (!this.roleSelections[roomId]) {
      this.roleSelections[roomId] = { blue: [], red: [] };
    }
  
    if (data.action === 'select') {
      // Vérifie si le rôle est déjà pris dans n'importe quelle équipe
      const isRoleTaken = 
        this.roleSelections[roomId].blue.includes(data.role) || 
        this.roleSelections[roomId].red.includes(data.role);
  
      if (!isRoleTaken) {
        this.roleSelections[roomId][data.team].push(data.role);
        console.log(this.roleSelections[roomId][data.team])
      }
    } else {
      // Désélection simple
      this.roleSelections[roomId][data.team] = 
        this.roleSelections[roomId][data.team].filter(r => r !== data.role);
    }
  
    return this.getRoomRoles(roomId);
  }

  getRoomRoles(roomId: string) {
    return this.roleSelections[roomId] || { blue: [], red: [] };
  }
}