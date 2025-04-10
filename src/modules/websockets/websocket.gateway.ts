import { 
  WebSocketGateway as WSGateway, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsJwtGuard } from './ws-jwt.guard';
import { JoinRoomDto } from './dto/join-room.dto';
import { ChatMessageDto } from './dto/chat-message.dto';
import { PrivateMessageDto } from './dto/private-message.dto';

@WSGateway({
  cors: {
    origin: '*', // In production, restrict this to your app's domains
  },
})
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebSocketGateway.name);
  
  @WebSocketServer()
  server: Server;
  
  constructor(
    private websocketService: WebSocketService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  
  /**
   * Lifecycle hook when the gateway is initialized
   */
  afterInit(server: Server) {
    this.websocketService.setSocketServer(server);
    this.logger.log('WebSocket Gateway initialized');
  }
  
  /**
   * Lifecycle hook when a client connects
   */
  async handleConnection(client: Socket) {
    try {
      // Get token from handshake headers
      const authHeader = client.handshake.headers.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header not provided');
      }
      
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedException('JWT token not provided');
      }
      
      // Verify and decode the token
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid JWT token');
      }
      
      // Store the user ID in the socket instance for later use
      client['userId'] = decoded.sub;
      
      // Register the client in the WebSocket service
      this.websocketService.registerClient(client, decoded.sub);
      
      // Acknowledge successful connection
      client.emit('connection_established', { 
        success: true, 
        userId: decoded.sub 
      });
      
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`, error.stack);
      client.emit('connection_error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }
  
  /**
   * Lifecycle hook when a client disconnects
   */
  handleDisconnect(client: Socket) {
    this.websocketService.removeClient(client);
  }
  
  /**
   * Join a room (e.g., a chat room)
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { room } = data;
      
      // Validate room name format (alphanumeric and underscores/hyphens only)
      const isValidRoom = /^[a-zA-Z0-9_-]+$/.test(room);
      
      if (!isValidRoom) {
        throw new WsException('Invalid room name format');
      }
      
      this.websocketService.joinRoom(client, room);
      
      const userId = client['userId'];
      
      // Notify room members about the new user
      this.websocketService.broadcastToRoom(room, 'user_joined', {
        userId,
        room,
        timestamp: new Date(),
      });
      
      // Return the list of users in the room
      return {
        event: 'joined',
        data: {
          room,
          users: this.websocketService.getUsersInRoom(room),
        },
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
  
  /**
   * Leave a room
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave')
  handleLeaveRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { room } = data;
      
      // Check if client is in the room
      if (!this.websocketService.isInRoom(client, room)) {
        throw new WsException('You are not in this room');
      }
      
      const userId = client['userId'];
      
      this.websocketService.leaveRoom(client, room);
      
      // Notify room members about the user leaving
      this.websocketService.broadcastToRoom(room, 'user_left', {
        userId,
        room,
        timestamp: new Date(),
      });
      
      return {
        event: 'left',
        data: {
          room,
          success: true,
        },
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
  
  /**
   * Send a message to a room
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { room, message } = data;
      
      // Check if client is in the room
      if (!this.websocketService.isInRoom(client, room)) {
        throw new WsException('You are not in this room');
      }
      
      const userId = client['userId'];
      
      // Create message object
      const messageObject = {
        room,
        userId,
        message,
        timestamp: new Date(),
      };
      
      // Broadcast the message to the room
      this.websocketService.broadcastToRoom(room, 'message', messageObject);
      
      return {
        event: 'message_sent',
        data: messageObject,
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
  
  /**
   * Send a private message to a specific user
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendPrivate')
  handlePrivateMessage(
    @MessageBody() data: PrivateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId: receiverId, message } = data;
      const senderId = client['userId'];
      
      // Check if the recipient exists (is online)
      if (!this.websocketService.isUserOnline(receiverId)) {
        return {
          event: 'private_message_status',
          data: {
            success: false,
            message: 'User is offline or does not exist',
            timestamp: new Date(),
          },
        };
      }
      
      // Create message object
      const messageObject = {
        from: senderId,
        to: receiverId,
        message,
        private: true,
        timestamp: new Date(),
      };
      
      // Send the private message to the recipient
      this.websocketService.sendToUser(receiverId, 'private_message', messageObject);
      
      // Also send a receipt to the sender
      return {
        event: 'private_message_status',
        data: {
          success: true,
          message: 'Message sent',
          recipient: receiverId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
  
  /**
   * Get list of users in a room
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('getRoomUsers')
  handleGetRoomUsers(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { room } = data;
      
      // Check if client is in the room
      if (!this.websocketService.isInRoom(client, room)) {
        throw new WsException('You are not in this room');
      }
      
      return {
        event: 'room_users',
        data: {
          room,
          users: this.websocketService.getUsersInRoom(room),
        },
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }
  
  /**
   * Ping to check connection
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return {
      event: 'pong',
      data: {
        userId: client['userId'],
        timestamp: new Date(),
      },
    };
  }
}