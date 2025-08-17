import { Exclude } from 'class-transformer';
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

  @ApiPropertyOptional({ description: 'User first name', example: 'John' })
  firstName?: string | null;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
  lastName?: string | null;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1-555-0123' })
  phoneNumber?: string | null;

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

  // B2B Hardware World specific fields
  @ApiPropertyOptional({ description: 'User job title', example: 'Procurement Manager' })
  jobTitle?: string | null;

  @ApiPropertyOptional({ description: 'Department user works in', example: 'Operations' })
  department?: string | null;

  @ApiPropertyOptional({ description: 'Maximum order amount user can approve', example: 50000 })
  approvalLimit?: number | null;

  // Malaysia E-Invoicing fields
  @ApiPropertyOptional({ description: 'Type of identification document', enum: ['NRIC', 'BRN', 'PASSPORT', 'ARMY'], example: 'NRIC' })
  idType?: string | null;

  @ApiPropertyOptional({ description: 'Identification document number', example: '800101141234' })
  idValue?: string | null;

  @ApiProperty({ description: 'User roles', type: [Object] })
  roles: Role[];

  @ApiPropertyOptional({ description: 'Companies this user belongs to', type: [Object] })
  companies?: UserCompany[];

  @ApiPropertyOptional({ description: 'Merchants this user belongs to', type: [Object] })
  merchants?: UserMerchant[];

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Account last updated date' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // Helper methods for determining user roles
  get isSystemAdmin(): boolean {
    return this.roles?.some(role => role.name === 'system_admin') || false;
  }

  get isMerchantAdmin(): boolean {
    return this.roles?.some(role => role.name === 'merchant_admin') || false;
  }

  get isMerchantUser(): boolean {
    return this.roles?.some(role => role.name === 'merchant_user') || false;
  }

  get isBuyer(): boolean {
    return this.roles?.some(role => role.name === 'buyer') || false;
  }

  get primaryRole(): string {
    if (this.isSystemAdmin) return 'system_admin';
    if (this.isMerchantAdmin) return 'merchant_admin';
    if (this.isMerchantUser) return 'merchant_user';
    if (this.isBuyer) return 'buyer';
    return 'unknown';
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.displayName || this.email;
  }

  // Helper method to check if user has a specific role
  hasRole(roleName: string): boolean {
    return this.roles?.some(role => role.name === roleName) || false;
  }

  // Helper method to get all role names
  getRoleNames(): string[] {
    return this.roles?.map(role => role.name) || [];
  }

  // Helper method to check if user belongs to a specific company
  belongsToCompany(companyId: string): boolean {
    return this.companies?.some(uc => uc.id === companyId) || false;
  }

  // Helper method to check if user belongs to a specific merchant
  belongsToMerchant(merchantId: string): boolean {
    return this.merchants?.some(um => um.id === merchantId) || false;
  }

  // Helper method to format user for API responses (excludes sensitive data)
  toPublicUser() {
    const { password, refreshToken, verifyToken, resetToken, ...publicUser } = this;
    return publicUser;
  }
}

// Supporting types for the User entity
export interface Role {
  id: string;
  name: string;
}

export interface UserCompany {
  id: string;
  name: string;
  displayName?: string;
  role: string;
}

export interface UserMerchant {
  id: string;
  name: string;
  displayName?: string;
  role: string;
}