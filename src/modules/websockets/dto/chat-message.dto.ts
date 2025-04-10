import { IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'Room name can only contain alphanumeric characters, underscores, and hyphens'
  })
  room: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000, { 
    message: 'Message is too long. Maximum length is 1000 characters.'
  })
  message: string;
}