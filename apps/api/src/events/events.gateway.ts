import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyJobCompleted(jobId: string, result: any) {
    this.server.emit(`job-result-${jobId}`, result);
  }
}
