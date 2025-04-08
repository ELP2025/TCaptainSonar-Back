import { Server, Socket } from 'socket.io';

let gameMap = {
    terrain: [
      ['🌳', '🌳', '🏠'],
      ['🌳', '🌊', '🌳'],
      ['🏠', '🌳', '🌊'],
    ],
  };

export const setupGameSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {

    socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
        console.log(`${socket.id} a rejoint la room ${roomName}`);
    
        // Envoyer un message à tous les clients dans la salle
        io.to(roomName).emit('message', `Un nouveau à bord ! ${roomName}`);
    });

    socket.emit('map_update', gameMap);
    
    socket.on('game_message', ({ team, role, message }) => {
        io.emit('message', `[${team} - ${role}]: ${message}`);
      });

    const modifyMapRandomly = () => {
        if (gameMap.terrain.length === 0) return;

    const newMap = gameMap.terrain.map(row =>
        row.map(cell => (Math.random() > 0.5 ? '🌳' : '🌊'))
        );

        if (socket) {
        socket.emit('update_map', { terrain: newMap });
        }
    socket.on('map_update', (data: string) => {
        if (data == "random") {modifyMapRandomly()};
        if (socket) {
            socket.emit('update_map', { terrain: newMap });
        }
      });
    };

    socket.on('Captain move', (data : {
        room: string;
        team: 'blue' | 'red';
        direction: 'N' | 'E' | 'S' | 'W';
        Distance: Int16Array; //Distance de 1 par défault, mais peut varier de 0 à 4 avec le déplacement furtif

    }) => {
        //Mets à jour la map et la redistribue aux joueurs

        // io.to(room).emit('map', GameMap);
    });

    socket.on('Surface', (data: {
        room:string;
        team : 'blue' | 'red';
    })=> {
        //Mets à jour la map et la redistribue aux joueurs
        
        // io.to(room).emit('map', GameMap);
    });

    socket.on('disconnect', () => {
        console.log("Coucou, je suis moi dans la foonction")
      console.log('Client déconnecté :', socket.id);
    });
  });
};