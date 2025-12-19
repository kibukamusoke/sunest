"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTeamMemberDto = exports.TeamStatsDto = exports.TeamMemberFilterDto = exports.TeamListResponseDto = exports.TeamMemberDto = exports.UpdateTeamMemberDto = exports.InviteTeamMemberDto = exports.Permission = exports.MerchantUserRole = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var MerchantUserRole;
(function (MerchantUserRole) {
    MerchantUserRole["ADMIN"] = "admin";
    MerchantUserRole["MANAGER"] = "manager";
    MerchantUserRole["USER"] = "user";
})(MerchantUserRole || (exports.MerchantUserRole = MerchantUserRole = {}));
var Permission;
(function (Permission) {
    Permission["MANAGE_PRODUCTS"] = "manage_products";
    Permission["MANAGE_ORDERS"] = "manage_orders";
    Permission["MANAGE_PRICING"] = "manage_pricing";
    Permission["VIEW_ANALYTICS"] = "view_analytics";
    Permission["MANAGE_INVENTORY"] = "manage_inventory";
    Permission["MANAGE_RFQ"] = "manage_rfq";
    Permission["MANAGE_FULFILLMENT"] = "manage_fulfillment";
})(Permission || (exports.Permission = Permission = {}));
class InviteTeamMemberDto {
}
exports.InviteTeamMemberDto = InviteTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the user to invite',
        example: 'john.doe@company.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role within the merchant organization',
        enum: MerchantUserRole,
        example: 'manager',
    }),
    (0, class_validator_1.IsEnum)(MerchantUserRole),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'First name of the user',
        example: 'John',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last name of the user', example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Job title', example: 'Sales Manager' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department', example: 'Sales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific permissions for this user',
        enum: Permission,
        isArray: true,
        example: ['manage_products', 'manage_orders'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(Permission, { each: true }),
    __metadata("design:type", Array)
], InviteTeamMemberDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Personal message for the invitation',
        example: 'Welcome to our team!',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteTeamMemberDto.prototype, "message", void 0);
class UpdateTeamMemberDto {
}
exports.UpdateTeamMemberDto = UpdateTeamMemberDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role within the merchant organization',
        enum: MerchantUserRole,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantUserRole),
    __metadata("design:type", String)
], UpdateTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Job title',
        example: 'Senior Sales Manager',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeamMemberDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Department', example: 'Sales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTeamMemberDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific permissions for this user',
        enum: Permission,
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(Permission, { each: true }),
    __metadata("design:type", Array)
], UpdateTeamMemberDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is the user active', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTeamMemberDto.prototype, "isActive", void 0);
class TeamMemberDto {
}
exports.TeamMemberDto = TeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name' }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title', required: false }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department', required: false }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role within merchant', enum: MerchantUserRole }),
    __metadata("design:type", String)
], TeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User permissions',
        enum: Permission,
        isArray: true,
    }),
    __metadata("design:type", Array)
], TeamMemberDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is user active' }),
    __metadata("design:type", Boolean)
], TeamMemberDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date joined merchant' }),
    __metadata("design:type", Date)
], TeamMemberDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last login date' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile picture URL' }),
    __metadata("design:type", Object)
], TeamMemberDto.prototype, "profilePictureUrl", void 0);
class TeamListResponseDto {
}
exports.TeamListResponseDto = TeamListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of team members', type: [TeamMemberDto] }),
    __metadata("design:type", Array)
], TeamListResponseDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total count of team members' }),
    __metadata("design:type", Number)
], TeamListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], TeamListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], TeamListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total pages' }),
    __metadata("design:type", Number)
], TeamListResponseDto.prototype, "totalPages", void 0);
class TeamMemberFilterDto {
}
exports.TeamMemberFilterDto = TeamMemberFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search term for name or email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamMemberFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by role',
        enum: MerchantUserRole,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(MerchantUserRole),
    __metadata("design:type", String)
], TeamMemberFilterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by department' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TeamMemberFilterDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TeamMemberFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TeamMemberFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], TeamMemberFilterDto.prototype, "limit", void 0);
class TeamStatsDto {
}
exports.TeamStatsDto = TeamStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total team members' }),
    __metadata("design:type", Number)
], TeamStatsDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active team members' }),
    __metadata("design:type", Number)
], TeamStatsDto.prototype, "activeMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pending invitations' }),
    __metadata("design:type", Number)
], TeamStatsDto.prototype, "pendingInvitations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Members by role',
        type: 'object',
        additionalProperties: { type: 'number' },
    }),
    __metadata("design:type", Object)
], TeamStatsDto.prototype, "membersByRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Members by department',
        type: 'object',
        additionalProperties: { type: 'number' },
    }),
    __metadata("design:type", Object)
], TeamStatsDto.prototype, "membersByDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recently joined members (last 30 days)' }),
    __metadata("design:type", Number)
], TeamStatsDto.prototype, "recentlyJoined", void 0);
class RemoveTeamMemberDto {
}
exports.RemoveTeamMemberDto = RemoveTeamMemberDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for removal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveTeamMemberDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Transfer data to another user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveTeamMemberDto.prototype, "transferToUserId", void 0);
//# sourceMappingURL=team-management.dto.js.map