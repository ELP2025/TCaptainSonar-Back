export type TeamType = 'blue' | 'red';

export interface RoleSelectionEvent {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
    socketId: string; // Ajoute cette ligne
  }

export interface RoomRoles {
  [roomId: string]: {
    blue: string[];
    red: string[];
  };
}