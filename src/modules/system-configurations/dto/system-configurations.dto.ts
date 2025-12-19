import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

const emptyStringToUndefined = ({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
};

export class SystemConfigurationsResponseDto {
    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'WhatsApp number (E.164 preferred).',
        example: '+60123456789',
    })
    whatsappNumber?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Application name shown in the storefront.',
        example: 'Intelibuy',
    })
    applicationName?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Primary phone number shown in the storefront.',
        example: '+60-123456789',
    })
    phoneNumber?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Primary email address shown in the storefront.',
        example: 'sales@intelibuy.com',
    })
    emailAddress?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description:
            'Canonical site URL used for building links (ticket links, share links, etc).',
        example: 'https://www.intelibuy.my',
    })
    siteUrl?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description:
            'Business address shown in the storefront (footer, contact pages). Can be multi-line.',
        example: 'Lot 56, Jalan Gasing 2\nPetaling Jaya, Selangor, Malaysia',
    })
    address?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description:
            'Business hours shown in the storefront. Can be multi-line.',
        example: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
    })
    businessHours?: string | null;

    @ApiPropertyOptional({
        type: [String],
        nullable: true,
        description:
            'Home page banner image URLs (ordered). These power the home page carousel.',
        example: [
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000000-abc123.jpg',
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000001-def456.jpg',
        ],
    })
    homeBannerImages?: string[] | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Facebook page URL shown in the storefront footer.',
        example: 'https://www.facebook.com/yourpage',
    })
    facebookUrl?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Twitter/X profile URL shown in the storefront footer.',
        example: 'https://x.com/yourhandle',
    })
    twitterUrl?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Instagram profile URL shown in the storefront footer.',
        example: 'https://www.instagram.com/yourhandle',
    })
    instagramUrl?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'LinkedIn page URL shown in the storefront footer.',
        example: 'https://www.linkedin.com/company/yourcompany',
    })
    linkedinUrl?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Privacy policy rich text (HTML).',
        example: '<h1>Privacy Policy</h1><p>...</p>',
    })
    privacyPolicyHtml?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Returns policy rich text (HTML).',
        example: '<h1>Returns Policy</h1><p>...</p>',
    })
    returnsPolicyHtml?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Terms and conditions rich text (HTML).',
        example: '<h1>Terms &amp; Conditions</h1><p>...</p>',
    })
    termsAndConditionsHtml?: string | null;
}

export class UpdateSystemConfigurationsDto {
    @ApiPropertyOptional({
        type: String,
        description: 'WhatsApp number (E.164 preferred).',
        example: '+60123456789',
    })
    @IsOptional()
    @IsString()
    whatsappNumber?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Application name shown in the storefront.',
        example: 'Intelibuy',
    })
    @IsOptional()
    @IsString()
    applicationName?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Primary phone number shown in the storefront.',
        example: '+60-123456789',
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Primary email address shown in the storefront.',
        example: 'sales@intelibuy.com',
    })
    @IsOptional()
    @IsEmail()
    emailAddress?: string;

    @ApiPropertyOptional({
        type: String,
        description:
            'Canonical site URL used for building links (ticket links, share links, etc).',
        example: 'https://www.intelibuy.my',
    })
    @IsOptional()
    @Transform(emptyStringToUndefined)
    @IsUrl({ require_tld: false })
    siteUrl?: string;

    @ApiPropertyOptional({
        type: String,
        description:
            'Business address shown in the storefront (footer, contact pages). Can be multi-line.',
        example: 'Lot 56, Jalan Gasing 2\nPetaling Jaya, Selangor, Malaysia',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        type: String,
        description:
            'Business hours shown in the storefront. Can be multi-line.',
        example: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed',
    })
    @IsOptional()
    @IsString()
    businessHours?: string;

    @ApiPropertyOptional({
        type: [String],
        description:
            'Home page banner image URLs (ordered). These power the home page carousel.',
        example: [
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000000-abc123.jpg',
            'https://my-bucket.s3.ap-southeast-1.amazonaws.com/1700000000001-def456.jpg',
        ],
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(20)
    @IsString({ each: true })
    homeBannerImages?: string[];

    @ApiPropertyOptional({
        type: String,
        description: 'Facebook page URL shown in the storefront footer.',
        example: 'https://www.facebook.com/yourpage',
    })
    @IsOptional()
    @Transform(emptyStringToUndefined)
    @IsUrl({ require_tld: false })
    facebookUrl?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Twitter/X profile URL shown in the storefront footer.',
        example: 'https://x.com/yourhandle',
    })
    @IsOptional()
    @Transform(emptyStringToUndefined)
    @IsUrl({ require_tld: false })
    twitterUrl?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Instagram profile URL shown in the storefront footer.',
        example: 'https://www.instagram.com/yourhandle',
    })
    @IsOptional()
    @Transform(emptyStringToUndefined)
    @IsUrl({ require_tld: false })
    instagramUrl?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'LinkedIn page URL shown in the storefront footer.',
        example: 'https://www.linkedin.com/company/yourcompany',
    })
    @IsOptional()
    @Transform(emptyStringToUndefined)
    @IsUrl({ require_tld: false })
    linkedinUrl?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Privacy policy rich text (HTML).',
        example: '<h1>Privacy Policy</h1><p>...</p>',
    })
    @IsOptional()
    @IsString()
    privacyPolicyHtml?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Returns policy rich text (HTML).',
        example: '<h1>Returns Policy</h1><p>...</p>',
    })
    @IsOptional()
    @IsString()
    returnsPolicyHtml?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Terms and conditions rich text (HTML).',
        example: '<h1>Terms &amp; Conditions</h1><p>...</p>',
    })
    @IsOptional()
    @IsString()
    termsAndConditionsHtml?: string;
}


