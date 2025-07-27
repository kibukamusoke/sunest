import { Module } from '@nestjs/common';
import { PrivacyPoliciesController } from './privacy-policies.controller';
import { PublicPrivacyPoliciesController } from './public-privacy-policies.controller';
import { PrivacyPoliciesService } from './privacy-policies.service';

@Module({
    controllers: [PrivacyPoliciesController, PublicPrivacyPoliciesController],
    providers: [PrivacyPoliciesService],
    exports: [PrivacyPoliciesService],
})
export class PrivacyPoliciesModule { } 