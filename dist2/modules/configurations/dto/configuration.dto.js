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
exports.CountriesListResponseDto = exports.StatesListResponseDto = exports.CountryResponseDto = exports.StateResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StateResponseDto {
}
exports.StateResponseDto = StateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State code',
        example: '01',
    }),
    __metadata("design:type", String)
], StateResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State name',
        example: 'Johor',
    }),
    __metadata("design:type", String)
], StateResponseDto.prototype, "state", void 0);
class CountryResponseDto {
}
exports.CountryResponseDto = CountryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country code (ISO 3166-1 alpha-2)',
        example: 'MY',
    }),
    __metadata("design:type", String)
], CountryResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country name',
        example: 'Malaysia',
    }),
    __metadata("design:type", String)
], CountryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country ranking (1 = highest priority)',
        example: 1,
    }),
    __metadata("design:type", Number)
], CountryResponseDto.prototype, "ranking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country region',
        example: 'Asia',
    }),
    __metadata("design:type", String)
], CountryResponseDto.prototype, "region", void 0);
class StatesListResponseDto {
}
exports.StatesListResponseDto = StatesListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of Malaysian states',
        type: [StateResponseDto],
    }),
    __metadata("design:type", Array)
], StatesListResponseDto.prototype, "states", void 0);
class CountriesListResponseDto {
}
exports.CountriesListResponseDto = CountriesListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of countries with ranking',
        type: [CountryResponseDto],
    }),
    __metadata("design:type", Array)
], CountriesListResponseDto.prototype, "countries", void 0);
//# sourceMappingURL=configuration.dto.js.map