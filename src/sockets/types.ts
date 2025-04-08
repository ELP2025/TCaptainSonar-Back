export type TeamType = 'blue' | 'red';
interface Team {
  Captain: string;
}
export interface TeamUpdate {
  blue: Team;
  red: Team;
}
// Définir une interface pour la structure globale du paquet JSON

export interface RoleSelectionEvent {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
    socketId: string;
  }

export interface RoomRoles {
  [roomId: string]: {
    blue: string[];
    red: string[];
  };
}
