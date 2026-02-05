import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Result, Progress } from '@repo/types';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleResult(socketId: string, jobId: string, payload: Result) {
    this.server.to(socketId).emit(`${jobId}-result`, payload);
  }

  handleProgress(socketId: string, jobId: string, payload: Progress) {
    this.server.to(socketId).emit(`${jobId}-progress`, payload);
  }
}
