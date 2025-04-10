import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'Room name can only contain alphanumeric characters, underscores, and hyphens'
  })
  room: string;
}