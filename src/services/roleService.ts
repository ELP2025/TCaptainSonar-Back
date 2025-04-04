import { RoomRoles, TeamType } from '../sockets/types';

export class RoleService {
  private roleSelections: RoomRoles = {};
  // On stocke qui a sélectionné quel rôle (socketId → { team, role })
  private playerRoles: Record<string, { roomId: string; team: TeamType; role: string }[]> = {};

  handleRoleSelection(roomId: string, data: {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
    socketId: string; // On passe aussi le socketId
  }): RoomRoles[string] {
    if (!this.roleSelections[roomId]) {
      this.roleSelections[roomId] = { blue: [], red: [] };
    }

    if (data.action === 'select') {
      const isRoleTaken = this.roleSelections[roomId][data.team].includes(data.role);
      if (!isRoleTaken) {
        this.roleSelections[roomId][data.team].push(data.role);
        // On enregistre le rôle attribué au joueur
        if (!this.playerRoles[data.socketId]) {
          this.playerRoles[data.socketId] = [];
        }
        this.playerRoles[data.socketId].push({ roomId, team: data.team, role: data.role });
      }
    } else {
      this.roleSelections[roomId][data.team] = 
        this.roleSelections[roomId][data.team].filter(r => r !== data.role);
      // On retire aussi le rôle du joueur
      if (this.playerRoles[data.socketId]) {
        this.playerRoles[data.socketId] = this.playerRoles[data.socketId].filter(
          r => !(r.roomId === roomId && r.team === data.team && r.role === data.role)
        );
      }
    }

    return this.getRoomRoles(roomId);
  }

  getRoomRoles(roomId: string) {
    return this.roleSelections[roomId] || { blue: [], red: [] };
  }

  // Nouvelle méthode : Nettoie les rôles d'un joueur déconnecté
  cleanupOnDisconnect(socketId: string) {
    if (!this.playerRoles[socketId]) return;

    this.playerRoles[socketId].forEach(({ roomId, team, role }) => {
      if (this.roleSelections[roomId]?.[team]) {
        this.roleSelections[roomId][team] = this.roleSelections[roomId][team].filter(r => r !== role);
      }
    });

    delete this.playerRoles[socketId]; // On nettoie
  }
}