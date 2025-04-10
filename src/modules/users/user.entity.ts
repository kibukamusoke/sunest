import { Exclude } from 'class-transformer';
import { File } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email: string;
  
  @Exclude()
  password?: string | null;
  
  @ApiPropertyOptional({ description: 'User display name', example: 'John Doe' })
  displayName?: string | null;
  
  @ApiPropertyOptional({ description: 'URL to user avatar image', example: 'https://example.com/avatar.jpg' })
  avatar?: string | null;
  
  @ApiProperty({ description: 'Whether user account is active', default: true })
  isActive: boolean;
  
  @ApiProperty({ description: 'Whether user email is verified', default: false })
  emailVerified: boolean;
  
  @Exclude()
  verifyToken?: string | null;
  
  @Exclude()
  resetToken?: string | null;
  
  @Exclude()
  resetTokenExpiry?: Date | null;
  
  @ApiPropertyOptional({ description: 'Authentication provider (local, google, github)', example: 'local' })
  provider?: string | null;
  
  @ApiPropertyOptional({ description: 'ID from auth provider', example: '123456789' })
  providerId?: string | null;
  
  @Exclude()
  refreshToken?: string | null;
  
  @ApiProperty({ description: 'User roles', type: [String], example: ['user'] })
  roles: string[];
  
  @ApiPropertyOptional({ description: 'Files owned by user', type: [File] })
  files?: File[];
  
  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;
  
  @ApiProperty({ description: 'Account last updated date' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}