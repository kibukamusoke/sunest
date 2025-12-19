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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PlacesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const places_service_1 = require("./places.service");
const places_dto_1 = require("./dto/places.dto");
let PlacesController = PlacesController_1 = class PlacesController {
    constructor(placesService) {
        this.placesService = placesService;
        this.logger = new common_1.Logger(PlacesController_1.name);
    }
    async getAutocomplete(query) {
        try {
            const result = await this.placesService.getAutocomplete(query.input);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logError('Failed to fetch autocomplete suggestions', error);
            throw new common_1.HttpException('Failed to fetch autocomplete suggestions', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPlaceDetails(query) {
        try {
            const result = await this.placesService.getPlaceDetails(query.place_id);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logError('Failed to fetch place details', error);
            throw new common_1.HttpException('Failed to fetch place details', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    logError(context, error) {
        if (error instanceof Error) {
            this.logger.error(`${context}: ${error.message}`, error.stack);
        }
        else {
            let serialized = '';
            try {
                serialized = JSON.stringify(error);
            }
            catch {
                serialized = String(error);
            }
            this.logger.error(`${context}: ${serialized}`);
        }
    }
};
exports.PlacesController = PlacesController;
__decorate([
    (0, common_1.Get)('autocomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Get place autocomplete suggestions' }),
    (0, swagger_1.ApiQuery)({
        name: 'input',
        description: 'Input text for autocomplete',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Autocomplete suggestions retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - missing or invalid input',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [places_dto_1.AutocompleteQueryDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "getAutocomplete", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, swagger_1.ApiOperation)({ summary: 'Get place details by place ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'place_id',
        description: 'Google Places place ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Place details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - missing or invalid place_id',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [places_dto_1.PlaceDetailsQueryDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "getPlaceDetails", null);
exports.PlacesController = PlacesController = PlacesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Places'),
    (0, common_1.Controller)('places'),
    __metadata("design:paramtypes", [places_service_1.PlacesService])
], PlacesController);
//# sourceMappingURL=places.controller.js.map