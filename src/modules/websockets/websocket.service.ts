import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

interface ConnectedUser {
  socketId: string;
  userId: string;
  rooms: Set<string>;
}

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);
  
  @WebSocketServer()
  private server: Server;
  
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private userIdToSocketId: Map<string, string> = new Map();
  
  constructor() {}
  
  /**
   * Initialize the socket server instance - called when server is created
   */
  setSocketServer(server: Server) {
    this.server = server;
    this.logger.log('WebSocket server initialized');
  }
  
  /**
   * Register a new connected client
   */
  registerClient(client: Socket, userId: string): void {
    this.logger.debug(`Client connected: ${client.id}, userId: ${userId}`);
    
    const userConnection: ConnectedUser = {
      socketId: client.id,
      userId,
      rooms: new Set<string>(),
    };
    
    this.connectedUsers.set(client.id, userConnection);
    this.userIdToSocketId.set(userId, client.id);
    
    // Join a user-specific room for private messages
    client.join(`user:${userId}`);
    userConnection.rooms.add(`user:${userId}`);
  }
  
  /**
   * Remove a client when they disconnect
   */
  removeClient(client: Socket): void {
    const userConnection = this.connectedUsers.get(client.id);
    
    if (userConnection) {
      this.logger.debug(`Client disconnected: ${client.id}, userId: ${userConnection.userId}`);
      this.userIdToSocketId.delete(userConnection.userId);
      this.connectedUsers.delete(client.id);
    } else {
      this.logger.debug(`Unknown client disconnected: ${client.id}`);
    }
  }
  
  /**
   * Add a client to a room
   */
  joinRoom(client: Socket, room: string): void {
    const userConnection = this.connectedUsers.get(client.id);
    
    if (!userConnection) {
      this.logger.warn(`Attempted to add unknown client ${client.id} to room ${room}`);
      return;
    }
    
    client.join(room);
    userConnection.rooms.add(room);
    this.logger.debug(`Client ${client.id} (${userConnection.userId}) joined room ${room}`);
  }
  
  /**
   * Remove a client from a room
   */
  leaveRoom(client: Socket, room: string): void {
    const userConnection = this.connectedUsers.get(client.id);
    
    if (!userConnection) {
      this.logger.warn(`Attempted to remove unknown client ${client.id} from room ${room}`);
      return;
    }
    
    client.leave(room);
    userConnection.rooms.delete(room);
    this.logger.debug(`Client ${client.id} (${userConnection.userId}) left room ${room}`);
  }
  
  /**
   * Check if a client is in a specific room
   */
  isInRoom(client: Socket, room: string): boolean {
    const userConnection = this.connectedUsers.get(client.id);
    
    if (!userConnection) {
      return false;
    }
    
    return userConnection.rooms.has(room);
  }
  
  /**
   * Send a message to all clients in a room
   */
  broadcastToRoom(room: string, event: string, data: any): void {
    this.logger.debug(`Broadcasting to room ${room}, event: ${event}`);
    this.server.to(room).emit(event, data);
  }
  
  /**
   * Send a message to a specific user
   */
  sendToUser(userId: string, event: string, data: any): boolean {
    const socketId = this.userIdToSocketId.get(userId);
    
    if (!socketId) {
      this.logger.warn(`Attempted to send message to unknown user ${userId}`);
      return false;
    }
    
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.debug(`Sent message to user ${userId}, event: ${event}`);
    return true;
  }
  
  /**
   * Send a message to all connected clients
   */
  broadcastToAll(event: string, data: any): void {
    this.logger.debug(`Broadcasting to all clients, event: ${event}`);
    this.server.emit(event, data);
  }
  
  /**
   * Get the number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.connectedUsers.size;
  }
  
  /**
   * Get the list of users in a specific room
   */
  getUsersInRoom(room: string): string[] {
    const usersInRoom: string[] = [];
    
    this.connectedUsers.forEach(user => {
      if (user.rooms.has(room)) {
        usersInRoom.push(user.userId);
      }
    });
    
    return usersInRoom;
  }
  
  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userIdToSocketId.has(userId);
  }
}