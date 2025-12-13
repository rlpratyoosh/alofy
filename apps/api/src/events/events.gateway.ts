import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import authConfig from 'src/config/auth.config';

interface AuthenticatedSocket extends Socket {
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwt: JwtService,
    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
  ) {}

  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => {
      try {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) throw new UnauthorizedException('Noo cookies found');

        const parsedCookies = cookie.parse(cookies);

        const token = parsedCookies['access_token'];

        if (!token) throw new UnauthorizedException('No token found');

        const payload = await this.jwt.verifyAsync(token, {
          secret: this.auth.secret,
        });

        socket['user'] = payload;
        next();
      } catch (error) {
        this.logger.warn(`Connection Blocked: ${error.message}`);
        next(new Error('Unauthorized'));
      }
    });
  }

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(
      `Client Connected: ${client.id} (User: ${client.user.username})`,
    );
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  notifyJobCompleted(jobId: string, result: any) {
    this.server.emit(`recieveResult`, result);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() message: { sender: string; message: string; time: Date },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    message.sender = client.user.username;
    this.server.emit('recieveMessage', message);
  }
}
