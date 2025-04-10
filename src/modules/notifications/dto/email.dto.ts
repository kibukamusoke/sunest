import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailAttachment {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  data: string; // Base64 encoded data
}

export class EmailRecipient {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
}

export class EmailDto {
  @ApiProperty({ type: [EmailRecipient] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipient)
  to: EmailRecipient[];

  @ApiProperty({ type: [EmailRecipient], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipient)
  @IsOptional()
  cc?: EmailRecipient[];

  @ApiProperty({ type: [EmailRecipient], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipient)
  @IsOptional()
  bcc?: EmailRecipient[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({ type: [EmailAttachment], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailAttachment)
  @IsOptional()
  attachments?: EmailAttachment[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  template?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  templateName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  templateVars?: Record<string, any>;
}

export class EmailTemplateDto {
  @ApiProperty({ type: [EmailRecipient] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipient)
  to: EmailRecipient[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty()
  templateVars: Record<string, any>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subject?: string;
}