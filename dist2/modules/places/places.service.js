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
var PlacesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let PlacesService = PlacesService_1 = class PlacesService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PlacesService_1.name);
        this.httpClient = axios_1.default.create({
            baseURL: 'https://places.googleapis.com/v1',
            timeout: 5000,
        });
    }
    async getAutocomplete(input) {
        const apiKey = this.resolveApiKey();
        try {
            const response = await this.httpClient.post('/places:autocomplete', {
                input,
                languageCode: 'en',
                regionCode: 'MY',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': [
                        'suggestions.placePrediction.placeId',
                        'suggestions.placePrediction.text.text',
                        'suggestions.placePrediction.structuredFormat.mainText',
                        'suggestions.placePrediction.structuredFormat.secondaryText',
                    ].join(','),
                },
            });
            const suggestions = response.data?.suggestions ?? [];
            const predictions = suggestions
                .map((suggestion) => suggestion?.placePrediction)
                .filter(Boolean)
                .map((prediction) => {
                const mainText = prediction.structuredFormat?.mainText?.text;
                const secondaryText = prediction.structuredFormat?.secondaryText?.text;
                const description = prediction.text?.text || mainText || '';
                return {
                    description,
                    place_id: prediction.placeId ?? '',
                    structured_formatting: {
                        main_text: mainText || description,
                        secondary_text: secondaryText || '',
                    },
                };
            })
                .filter((prediction) => prediction.place_id);
            const status = predictions.length > 0 ? 'OK' : 'ZERO_RESULTS';
            return {
                predictions,
                status,
            };
        }
        catch (error) {
            this.logError('Error fetching autocomplete suggestions', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw this.toHttpException(error, 'Failed to fetch autocomplete suggestions');
        }
    }
    async getPlaceDetails(placeId) {
        const apiKey = this.resolveApiKey();
        try {
            const response = await this.httpClient.get(`/places/${encodeURIComponent(placeId)}`, {
                headers: {
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': [
                        'id',
                        'formattedAddress',
                        'displayName.text',
                        'addressComponents.longText',
                        'addressComponents.shortText',
                        'addressComponents.types',
                        'location.latitude',
                        'location.longitude',
                    ].join(','),
                },
                params: {
                    languageCode: 'en',
                },
            });
            const result = response.data;
            if (!result) {
                const message = 'Google Places Details request returned no data';
                this.logger.warn(`Place details request failed: ${message}`);
                throw new common_1.BadRequestException(message);
            }
            return {
                result: {
                    formatted_address: result.formattedAddress || '',
                    name: result.displayName?.text || '',
                    address_components: result.addressComponents?.map((component) => ({
                        long_name: component.longText,
                        short_name: component.shortText,
                        types: component.types ?? [],
                    })) || [],
                    geometry: {
                        location: {
                            lat: result.location?.latitude || 0,
                            lng: result.location?.longitude || 0,
                        },
                    },
                },
                status: 'OK',
            };
        }
        catch (error) {
            this.logError('Error fetching place details', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw this.toHttpException(error, 'Failed to fetch place details');
        }
    }
    resolveApiKey() {
        const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY') ||
            this.configService.get('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            this.logger.error('Google Maps API key is not configured. Set GOOGLE_MAPS_API_KEY (or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) in the environment.');
            throw new common_1.ServiceUnavailableException('Google Maps integration is not configured');
        }
        return apiKey;
    }
    logError(message, error) {
        if (error instanceof Error) {
            this.logger.error(`${message}: ${error.message}`, error.stack);
            if (axios_1.default.isAxiosError(error) && error.response?.data) {
                let serialized = '';
                try {
                    serialized = JSON.stringify(error.response.data);
                }
                catch {
                    serialized = String(error.response.data);
                }
                this.logger.error(`${message} - Google response: ${serialized}`);
            }
        }
        else {
            let serialized = '';
            try {
                serialized = JSON.stringify(error);
            }
            catch {
                serialized = String(error);
            }
            this.logger.error(`${message}: ${serialized}`);
        }
    }
    toHttpException(error, fallbackMessage) {
        if (axios_1.default.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const googleMessage = error.response?.data?.error_message ||
                error.response?.data?.status ||
                error.message ||
                fallbackMessage;
            if (statusCode && statusCode >= 400 && statusCode < 500) {
                return new common_1.HttpException(googleMessage, statusCode);
            }
            return new common_1.ServiceUnavailableException(googleMessage);
        }
        return new common_1.ServiceUnavailableException(fallbackMessage);
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = PlacesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PlacesService);
//# sourceMappingURL=places.service.js.map