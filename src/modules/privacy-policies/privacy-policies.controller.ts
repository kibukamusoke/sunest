import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Put,
    Delete,
    Body,
    HttpException,
    HttpStatus,
    Res,
    Render,
} from '@nestjs/common';
import { Response } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { PrivacyPoliciesService, PrivacyPolicy } from './privacy-policies.service';

// DTOs for API documentation
export class PrivacyPolicyDto {
    id: string;
    appName: string;
    appId: string;
    version: string;
    lastUpdated: string;
    content: string;
    language: string;
}

export class CreatePrivacyPolicyDto {
    id: string;
    appName: string;
    appId: string;
    version: string;
    content: string;
    language?: string;
}

export class UpdatePrivacyPolicyDto {
    appName?: string;
    appId?: string;
    version?: string;
    content?: string;
    language?: string;
}

@ApiTags('privacy-policies')
@Controller('privacy-policies')
export class PrivacyPoliciesController {
    constructor(private readonly privacyPoliciesService: PrivacyPoliciesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all privacy policies' })
    @ApiResponse({
        status: 200,
        description: 'List of all privacy policies',
        type: [PrivacyPolicyDto],
    })
    getAllPolicies(): PrivacyPolicy[] {
        return this.privacyPoliciesService.getAllPolicies();
    }

    @Get('ids')
    @ApiOperation({ summary: 'Get all privacy policy IDs' })
    @ApiResponse({
        status: 200,
        description: 'List of privacy policy IDs',
        type: [String],
    })
    getPolicyIds(): string[] {
        return this.privacyPoliciesService.getPolicyIds();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get privacy policy by ID' })
    @ApiParam({ name: 'id', description: 'Privacy policy ID' })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy found',
        type: PrivacyPolicyDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    getPolicyById(@Param('id') id: string): PrivacyPolicy {
        const policy = this.privacyPoliciesService.getPolicyById(id);
        if (!policy) {
            throw new HttpException(
                `Privacy policy with ID '${id}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        return policy;
    }

    @Get('app/:appId')
    @ApiOperation({ summary: 'Get privacy policy by app ID' })
    @ApiParam({ name: 'appId', description: 'Application ID' })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy found',
        type: PrivacyPolicyDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    getPolicyByAppId(@Param('appId') appId: string): PrivacyPolicy {
        const policy = this.privacyPoliciesService.getPolicyByAppId(appId);
        if (!policy) {
            throw new HttpException(
                `Privacy policy for app ID '${appId}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        return policy;
    }

    @Get('app/name/:appName')
    @ApiOperation({ summary: 'Get privacy policy by app name' })
    @ApiParam({ name: 'appName', description: 'Application name' })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy found',
        type: PrivacyPolicyDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    getPolicyByAppName(@Param('appName') appName: string): PrivacyPolicy {
        const policy = this.privacyPoliciesService.getPolicyByAppName(appName);
        if (!policy) {
            throw new HttpException(
                `Privacy policy for app '${appName}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        return policy;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new privacy policy' })
    @ApiBody({ type: CreatePrivacyPolicyDto })
    @ApiResponse({
        status: 201,
        description: 'Privacy policy created successfully',
        type: PrivacyPolicyDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data',
    })
    @ApiResponse({
        status: 409,
        description: 'Privacy policy with this ID already exists',
    })
    createPolicy(@Body() createPolicyDto: CreatePrivacyPolicyDto): PrivacyPolicy {
        const existingPolicy = this.privacyPoliciesService.getPolicyById(
            createPolicyDto.id,
        );
        if (existingPolicy) {
            throw new HttpException(
                `Privacy policy with ID '${createPolicyDto.id}' already exists`,
                HttpStatus.CONFLICT,
            );
        }

        const newPolicy: PrivacyPolicy = {
            ...createPolicyDto,
            lastUpdated: new Date().toISOString().split('T')[0],
            language: createPolicyDto.language || 'en',
        };

        this.privacyPoliciesService.addPolicy(newPolicy);
        return newPolicy;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing privacy policy' })
    @ApiParam({ name: 'id', description: 'Privacy policy ID' })
    @ApiBody({ type: UpdatePrivacyPolicyDto })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy updated successfully',
        type: PrivacyPolicyDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    updatePolicy(
        @Param('id') id: string,
        @Body() updatePolicyDto: UpdatePrivacyPolicyDto,
    ): PrivacyPolicy {
        const success = this.privacyPoliciesService.updatePolicy(id, {
            ...updatePolicyDto,
            lastUpdated: new Date().toISOString().split('T')[0],
        });

        if (!success) {
            throw new HttpException(
                `Privacy policy with ID '${id}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        const updatedPolicy = this.privacyPoliciesService.getPolicyById(id);
        if (!updatedPolicy) {
            throw new HttpException(
                'Failed to retrieve updated policy',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return updatedPolicy;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a privacy policy' })
    @ApiParam({ name: 'id', description: 'Privacy policy ID' })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    deletePolicy(@Param('id') id: string): { message: string } {
        const success = this.privacyPoliciesService.deletePolicy(id);
        if (!success) {
            throw new HttpException(
                `Privacy policy with ID '${id}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return { message: `Privacy policy '${id}' deleted successfully` };
    }

    @Get(':id/content')
    @ApiOperation({ summary: 'Get privacy policy content only' })
    @ApiParam({ name: 'id', description: 'Privacy policy ID' })
    @ApiResponse({
        status: 200,
        description: 'Privacy policy content',
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string' },
                lastUpdated: { type: 'string' },
                version: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Privacy policy not found',
    })
    getPolicyContent(@Param('id') id: string): {
        content: string;
        lastUpdated: string;
        version: string;
    } {
        const policy = this.privacyPoliciesService.getPolicyById(id);
        if (!policy) {
            throw new HttpException(
                `Privacy policy with ID '${id}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            content: policy.content,
            lastUpdated: policy.lastUpdated,
            version: policy.version,
        };
    }

    @Get('search/query')
    @ApiOperation({ summary: 'Search privacy policies' })
    @ApiQuery({ name: 'q', description: 'Search query', required: false })
    @ApiQuery({ name: 'language', description: 'Language filter', required: false })
    @ApiResponse({
        status: 200,
        description: 'Search results',
        type: [PrivacyPolicyDto],
    })
    searchPolicies(
        @Query('q') query?: string,
        @Query('language') language?: string,
    ): PrivacyPolicy[] {
        let policies = this.privacyPoliciesService.getAllPolicies();

        if (language) {
            policies = policies.filter(
                policy => policy.language.toLowerCase() === language.toLowerCase(),
            );
        }

        if (query) {
            const searchTerm = query.toLowerCase();
            policies = policies.filter(
                policy =>
                    policy.appName.toLowerCase().includes(searchTerm) ||
                    policy.content.toLowerCase().includes(searchTerm) ||
                    policy.appId.toLowerCase().includes(searchTerm),
            );
        }

        return policies;
    }

    // Web page rendering endpoints
    @Get('web')
    @Render('privacy-policies-list')
    @ApiOperation({ summary: 'Render privacy policies list page' })
    async renderPoliciesList(
        @Query('q') query?: string,
        @Query('language') language?: string,
    ) {
        let policies = this.privacyPoliciesService.getAllPolicies();

        if (language) {
            policies = policies.filter(
                policy => policy.language.toLowerCase() === language.toLowerCase(),
            );
        }

        if (query) {
            const searchTerm = query.toLowerCase();
            policies = policies.filter(
                policy =>
                    policy.appName.toLowerCase().includes(searchTerm) ||
                    policy.content.toLowerCase().includes(searchTerm) ||
                    policy.appId.toLowerCase().includes(searchTerm),
            );
        }

        return {
            policies,
            searchQuery: query || '',
            language: language || '',
            currentYear: new Date().getFullYear(),
        };
    }

    @Get('web/:id')
    @Render('privacy-policy')
    @ApiOperation({ summary: 'Render privacy policy page' })
    @ApiParam({ name: 'id', description: 'Privacy policy ID' })
    async renderPolicyPage(@Param('id') id: string) {
        const policy = this.privacyPoliciesService.getPolicyById(id);
        if (!policy) {
            throw new HttpException(
                `Privacy policy with ID '${id}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            ...policy,
            currentYear: new Date().getFullYear(),
        };
    }

    @Get('web/app/:appId')
    @Render('privacy-policy')
    @ApiOperation({ summary: 'Render privacy policy page by app ID' })
    @ApiParam({ name: 'appId', description: 'Application ID' })
    async renderPolicyPageByAppId(@Param('appId') appId: string) {
        const policy = this.privacyPoliciesService.getPolicyByAppId(appId);
        if (!policy) {
            throw new HttpException(
                `Privacy policy for app ID '${appId}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            ...policy,
            currentYear: new Date().getFullYear(),
        };
    }

    @Get('web/app/name/:appName')
    @Render('privacy-policy')
    @ApiOperation({ summary: 'Render privacy policy page by app name' })
    @ApiParam({ name: 'appName', description: 'Application name' })
    async renderPolicyPageByAppName(@Param('appName') appName: string) {
        const policy = this.privacyPoliciesService.getPolicyByAppName(appName);
        if (!policy) {
            throw new HttpException(
                `Privacy policy for app '${appName}' not found`,
                HttpStatus.NOT_FOUND,
            );
        }

        return {
            ...policy,
            currentYear: new Date().getFullYear(),
        };
    }
} 