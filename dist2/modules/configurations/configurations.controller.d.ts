import { ConfigurationsService } from './configurations.service';
import { StatesListResponseDto, CountriesListResponseDto } from './dto/configuration.dto';
export declare class ConfigurationsController {
    private readonly configurationsService;
    constructor(configurationsService: ConfigurationsService);
    getMalaysianStates(): Promise<StatesListResponseDto>;
    getCountries(region?: string): Promise<CountriesListResponseDto>;
}
