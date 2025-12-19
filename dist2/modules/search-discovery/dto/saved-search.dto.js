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
exports.SearchPreferencesDto = exports.BulkMarkAlertsReadDto = exports.MarkAlertReadDto = exports.SearchAlertListDto = exports.SearchAlertDto = exports.ExecuteSavedSearchDto = exports.SavedSearchListDto = exports.SavedSearchResponseDto = exports.UpdateSavedSearchDto = exports.CreateSavedSearchDto = exports.AlertFrequency = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AlertFrequency;
(function (AlertFrequency) {
    AlertFrequency["IMMEDIATE"] = "IMMEDIATE";
    AlertFrequency["DAILY"] = "DAILY";
    AlertFrequency["WEEKLY"] = "WEEKLY";
    AlertFrequency["MONTHLY"] = "MONTHLY";
})(AlertFrequency || (exports.AlertFrequency = AlertFrequency = {}));
class CreateSavedSearchDto {
    constructor() {
        this.alertOnNewResults = false;
        this.alertOnPriceChange = false;
        this.alertFrequency = AlertFrequency.DAILY;
        this.priceChangeThreshold = 5;
    }
}
exports.CreateSavedSearchDto = CreateSavedSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name for the saved search',
        example: 'High-end Graphics Cards',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateSavedSearchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term',
        example: 'graphics card',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateSavedSearchDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search filters configuration',
        type: Object,
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSavedSearchDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert when new products match this search',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSavedSearchDto.prototype, "alertOnNewResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert when prices change for matching products',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSavedSearchDto.prototype, "alertOnPriceChange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert frequency',
        example: 'DAILY',
        enum: AlertFrequency,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AlertFrequency),
    __metadata("design:type", String)
], CreateSavedSearchDto.prototype, "alertFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price change threshold percentage for alerts',
        example: 5,
        minimum: 1,
        maximum: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateSavedSearchDto.prototype, "priceChangeThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description or notes for this saved search',
        example: 'Monitor high-end graphics cards for upcoming project',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSavedSearchDto.prototype, "description", void 0);
class UpdateSavedSearchDto {
}
exports.UpdateSavedSearchDto = UpdateSavedSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name for the saved search',
        example: 'Updated High-end Graphics Cards',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateSavedSearchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term',
        example: 'high-end graphics card',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], UpdateSavedSearchDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search filters configuration',
        type: Object,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSavedSearchDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert when new products match this search',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSavedSearchDto.prototype, "alertOnNewResults", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert when prices change for matching products',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSavedSearchDto.prototype, "alertOnPriceChange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alert frequency',
        example: 'WEEKLY',
        enum: AlertFrequency,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AlertFrequency),
    __metadata("design:type", String)
], UpdateSavedSearchDto.prototype, "alertFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Price change threshold percentage for alerts',
        example: 10,
        minimum: 1,
        maximum: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], UpdateSavedSearchDto.prototype, "priceChangeThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description or notes for this saved search',
        example: 'Updated description',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSavedSearchDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the saved search is active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSavedSearchDto.prototype, "isActive", void 0);
class SavedSearchResponseDto {
}
exports.SavedSearchResponseDto = SavedSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saved search ID',
        example: 'saved-search-uuid',
    }),
    __metadata("design:type", String)
], SavedSearchResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who owns this search',
        example: 'user-uuid',
    }),
    __metadata("design:type", String)
], SavedSearchResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search name',
        example: 'High-end Graphics Cards',
    }),
    __metadata("design:type", String)
], SavedSearchResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term',
        example: 'graphics card',
    }),
    __metadata("design:type", String)
], SavedSearchResponseDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search filters',
        type: Object,
    }),
    __metadata("design:type", Object)
], SavedSearchResponseDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert settings',
    }),
    __metadata("design:type", Object)
], SavedSearchResponseDto.prototype, "alerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search statistics',
    }),
    __metadata("design:type", Object)
], SavedSearchResponseDto.prototype, "statistics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description or notes',
        example: 'Monitor high-end graphics cards',
    }),
    __metadata("design:type", String)
], SavedSearchResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the search is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SavedSearchResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SavedSearchResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SavedSearchResponseDto.prototype, "updatedAt", void 0);
class SavedSearchListDto {
}
exports.SavedSearchListDto = SavedSearchListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of saved searches',
        type: [SavedSearchResponseDto],
    }),
    __metadata("design:type", Array)
], SavedSearchListDto.prototype, "searches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total count of saved searches',
        example: 15,
    }),
    __metadata("design:type", Number)
], SavedSearchListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active searches count',
        example: 12,
    }),
    __metadata("design:type", Number)
], SavedSearchListDto.prototype, "activeCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Searches with alerts enabled',
        example: 8,
    }),
    __metadata("design:type", Number)
], SavedSearchListDto.prototype, "alertEnabledCount", void 0);
class ExecuteSavedSearchDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.includeAvailability = true;
        this.includePricing = true;
    }
}
exports.ExecuteSavedSearchDto = ExecuteSavedSearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saved search ID to execute',
        example: 'saved-search-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecuteSavedSearchDto.prototype, "searchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Override pagination - page number',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ExecuteSavedSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Override pagination - items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ExecuteSavedSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include availability information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExecuteSavedSearchDto.prototype, "includeAvailability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include pricing information',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExecuteSavedSearchDto.prototype, "includePricing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warehouse ID for availability filtering',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecuteSavedSearchDto.prototype, "warehouseId", void 0);
class SearchAlertDto {
}
exports.SearchAlertDto = SearchAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert ID',
        example: 'alert-uuid',
    }),
    __metadata("design:type", String)
], SearchAlertDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saved search that triggered this alert',
        type: SavedSearchResponseDto,
    }),
    __metadata("design:type", SavedSearchResponseDto)
], SearchAlertDto.prototype, "savedSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert type',
        example: 'NEW_RESULTS',
        enum: ['NEW_RESULTS', 'PRICE_CHANGE', 'BACK_IN_STOCK'],
    }),
    __metadata("design:type", String)
], SearchAlertDto.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert message',
        example: '5 new products found matching your saved search',
    }),
    __metadata("design:type", String)
], SearchAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of new results (for NEW_RESULTS alerts)',
        example: 5,
    }),
    __metadata("design:type", Number)
], SearchAlertDto.prototype, "newResultCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price changes (for PRICE_CHANGE alerts)',
        type: [Object],
    }),
    __metadata("design:type", Array)
], SearchAlertDto.prototype, "priceChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert created timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], SearchAlertDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether alert has been read',
        example: false,
    }),
    __metadata("design:type", Boolean)
], SearchAlertDto.prototype, "isRead", void 0);
class SearchAlertListDto {
}
exports.SearchAlertListDto = SearchAlertListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of search alerts',
        type: [SearchAlertDto],
    }),
    __metadata("design:type", Array)
], SearchAlertListDto.prototype, "alerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total count of alerts',
        example: 25,
    }),
    __metadata("design:type", Number)
], SearchAlertListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unread alerts count',
        example: 8,
    }),
    __metadata("design:type", Number)
], SearchAlertListDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
    }),
    __metadata("design:type", Object)
], SearchAlertListDto.prototype, "pagination", void 0);
class MarkAlertReadDto {
}
exports.MarkAlertReadDto = MarkAlertReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert ID to mark as read',
        example: 'alert-uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MarkAlertReadDto.prototype, "alertId", void 0);
class BulkMarkAlertsReadDto {
}
exports.BulkMarkAlertsReadDto = BulkMarkAlertsReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert IDs to mark as read',
        example: ['alert-1-uuid', 'alert-2-uuid'],
        type: [String],
    }),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], BulkMarkAlertsReadDto.prototype, "alertIds", void 0);
class SearchPreferencesDto {
    constructor() {
        this.defaultPageSize = 20;
        this.defaultSortField = 'relevance';
        this.defaultSortOrder = 'desc';
        this.saveSearchHistory = true;
        this.enableSuggestions = true;
        this.enableTypoCorrection = true;
    }
}
exports.SearchPreferencesDto = SearchPreferencesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default items per page for searches',
        example: 20,
        minimum: 10,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchPreferencesDto.prototype, "defaultPageSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default sort field',
        example: 'relevance',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchPreferencesDto.prototype, "defaultSortField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchPreferencesDto.prototype, "defaultSortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auto-save search history',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchPreferencesDto.prototype, "saveSearchHistory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable search suggestions',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchPreferencesDto.prototype, "enableSuggestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable typo correction',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchPreferencesDto.prototype, "enableTypoCorrection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred categories for search',
        example: ['processors', 'graphics-cards'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchPreferencesDto.prototype, "preferredCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred brands for search',
        example: ['Intel', 'AMD', 'NVIDIA'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SearchPreferencesDto.prototype, "preferredBrands", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default warehouse for availability filtering',
        example: 'warehouse-uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchPreferencesDto.prototype, "defaultWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email notification preferences',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SearchPreferencesDto.prototype, "emailNotifications", void 0);
//# sourceMappingURL=saved-search.dto.js.map