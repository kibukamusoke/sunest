import { ConfigService } from '@nestjs/config';
import { AutocompleteResponseDto, PlaceDetailsResponseDto } from './dto/places.dto';
export declare class PlacesService {
    private configService;
    private readonly logger;
    private readonly httpClient;
    constructor(configService: ConfigService);
    getAutocomplete(input: string): Promise<AutocompleteResponseDto>;
    getPlaceDetails(placeId: string): Promise<PlaceDetailsResponseDto>;
    private resolveApiKey;
    private logError;
    private toHttpException;
}
