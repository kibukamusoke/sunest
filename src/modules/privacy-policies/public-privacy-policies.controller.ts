import {
    Controller,
    Get,
    Param,
    Query,
    HttpException,
    HttpStatus,
    Render,
} from '@nestjs/common';
import { PrivacyPoliciesService } from './privacy-policies.service';

@Controller()
export class PublicPrivacyPoliciesController {
    constructor(private readonly privacyPoliciesService: PrivacyPoliciesService) { }

    @Get('privacy-policies')
    @Render('privacy-policies-list')
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

    @Get('privacy-policy/:id')
    @Render('privacy-policy')
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

    @Get('privacy-policy/app/:appId')
    @Render('privacy-policy')
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

    @Get('privacy-policy/app/name/:appName')
    @Render('privacy-policy')
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

    // Redirect root to privacy policies list
    @Get('/')
    async redirectToPrivacyPolicies() {
        return { redirect: '/privacy-policies' };
    }
} 