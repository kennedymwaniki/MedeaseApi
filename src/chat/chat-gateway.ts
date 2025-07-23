// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// @WebSocketGateway(3002, { cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   handleConnection(client: Socket): void {
//     console.log(`Client connected: ${client.id}`);
//     client.emit(
//       'connected',
//       `Welcome! You are connected with ID: ${client.id}`,
//     );
//   }

//   handleDisconnect(client: Socket): void {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('message')
//   handleMessage(client: Socket, message: any): void {
//     client.emit('reply', `Received: ${message} nice to meet you`);

//     this.server.emit('reply', 'Messagebroadcasted: ' + message);
//     console.log('Message received:', message);
//   }
// }
