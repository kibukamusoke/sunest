import { IsNotEmpty, IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class PrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000, { 
    message: 'Message is too long. Maximum length is 1000 characters.'
  })
  message: string;
}