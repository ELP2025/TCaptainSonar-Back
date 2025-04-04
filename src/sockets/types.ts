export type TeamType = 'blue' | 'red';

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