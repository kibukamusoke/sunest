import { PlacesService } from './places.service';
import { AutocompleteQueryDto, PlaceDetailsQueryDto, AutocompleteResponseDto, PlaceDetailsResponseDto } from './dto/places.dto';
export declare class PlacesController {
    private readonly placesService;
    private readonly logger;
    constructor(placesService: PlacesService);
    getAutocomplete(query: AutocompleteQueryDto): Promise<AutocompleteResponseDto>;
    getPlaceDetails(query: PlaceDetailsQueryDto): Promise<PlaceDetailsResponseDto>;
    private logError;
}
