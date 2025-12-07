import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
    this.server.emit(`recieveResult`, result);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() message: { sender: string; message: string; time: Date },
  ) {
    console.log(message);
    this.server.emit('recieveMessage', message);
  }
}
