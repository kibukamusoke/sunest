import { StatesListResponseDto, CountriesListResponseDto } from './dto/configuration.dto';
export declare class ConfigurationsService {
    private readonly malaysianStates;
    private readonly countries;
    getMalaysianStates(): Promise<StatesListResponseDto>;
    getCountries(): Promise<CountriesListResponseDto>;
    getCountriesByRegion(region: string): Promise<CountriesListResponseDto>;
}
