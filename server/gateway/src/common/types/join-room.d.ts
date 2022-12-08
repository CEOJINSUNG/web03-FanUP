import { Server, Socket } from 'socket.io';

interface JoinRoom {
  server: Server;
  socket: Socket;
  userId: number;
  room: string;
}

export { JoinRoom };
