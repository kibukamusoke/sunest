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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const configurations_service_1 = require("./configurations.service");
const configuration_dto_1 = require("./dto/configuration.dto");
let ConfigurationsController = class ConfigurationsController {
    constructor(configurationsService) {
        this.configurationsService = configurationsService;
    }
    async getMalaysianStates() {
        return this.configurationsService.getMalaysianStates();
    }
    async getCountries(region) {
        if (region) {
            return this.configurationsService.getCountriesByRegion(region);
        }
        return this.configurationsService.getCountries();
    }
};
exports.ConfigurationsController = ConfigurationsController;
__decorate([
    (0, common_1.Get)('states'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Malaysian states',
        description: 'Retrieve a list of all Malaysian states with their codes',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Malaysian states retrieved successfully',
        type: configuration_dto_1.StatesListResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigurationsController.prototype, "getMalaysianStates", null);
__decorate([
    (0, common_1.Get)('countries'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get countries with ranking',
        description: 'Retrieve a list of all countries with their ranking (Malaysia = 1, China = 2, followed by Asian countries, then rest of the world)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'region',
        required: false,
        description: 'Filter countries by region (Asia, Europe, North America, South America, Africa, Oceania)',
        enum: [
            'Asia',
            'Europe',
            'North America',
            'South America',
            'Africa',
            'Oceania',
        ],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Countries retrieved successfully',
        type: configuration_dto_1.CountriesListResponseDto,
    }),
    __param(0, (0, common_1.Query)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigurationsController.prototype, "getCountries", null);
exports.ConfigurationsController = ConfigurationsController = __decorate([
    (0, swagger_1.ApiTags)('Configurations'),
    (0, common_1.Controller)('configurations'),
    __metadata("design:paramtypes", [configurations_service_1.ConfigurationsService])
], ConfigurationsController);
//# sourceMappingURL=configurations.controller.js.map