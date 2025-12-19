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
exports.RegisterDto = exports.Industry = exports.CompanySize = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var CompanySize;
(function (CompanySize) {
    CompanySize["STARTUP"] = "1-10";
    CompanySize["SMALL"] = "11-50";
    CompanySize["MEDIUM"] = "51-200";
    CompanySize["LARGE"] = "201-500";
    CompanySize["ENTERPRISE"] = "501-1000";
    CompanySize["CORPORATION"] = "1000+";
})(CompanySize || (exports.CompanySize = CompanySize = {}));
var Industry;
(function (Industry) {
    Industry["TECHNOLOGY"] = "technology";
    Industry["MANUFACTURING"] = "manufacturing";
    Industry["HEALTHCARE"] = "healthcare";
    Industry["FINANCE"] = "finance";
    Industry["EDUCATION"] = "education";
    Industry["RETAIL"] = "retail";
    Industry["CONSTRUCTION"] = "construction";
    Industry["TELECOMMUNICATIONS"] = "telecommunications";
    Industry["GOVERNMENT"] = "government";
    Industry["OTHER"] = "other";
})(Industry || (exports.Industry = Industry = {}));
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'john@acmetech.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password for the account', minLength: 8 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name of the user', example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], RegisterDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Job title in the company',
        example: 'Procurement Manager',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], RegisterDto.prototype, "jobTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+1-555-123-4567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company name',
        example: 'Acme Technologies Inc.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 100),
    __metadata("design:type", String)
], RegisterDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], RegisterDto.prototype, "companyDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Company website URL',
        example: 'https://acmetech.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "companyWebsite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Company size',
        enum: CompanySize,
        example: CompanySize.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(CompanySize),
    __metadata("design:type", String)
], RegisterDto.prototype, "companySize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Industry sector',
        enum: Industry,
        example: Industry.TECHNOLOGY,
    }),
    (0, class_validator_1.IsEnum)(Industry),
    __metadata("design:type", String)
], RegisterDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to avatar image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    __metadata("design:type", String)
], RegisterDto.prototype, "avatar", void 0);
//# sourceMappingURL=register.dto.js.map