export type TeamType = 'blue' | 'red';

export interface RoleSelectionEvent {
    team: TeamType;
    role: string;
    action: 'select' | 'deselect';
    playerId:string
    socketId: string;
  }

export interface RoomRoles {
  [roomId: string]: {
    blue: {
      captain:string 
     };
    red: {
     captain:string 
    };
  };
}

export type Team = {
  Captain: string;
};

export type TeamUpdate = {
  blue: Team;
  red: Team;
};