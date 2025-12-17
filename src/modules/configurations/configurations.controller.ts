import {
  Controller,
  Get,
  Query,
  HttpStatus,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ConfigurationsService } from './configurations.service';
import {
  StateResponseDto,
  CountryResponseDto,
  StatesListResponseDto,
  CountriesListResponseDto,
} from './dto/configuration.dto';

@ApiTags('Configurations')
@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Get('states')
  @Public()
  @ApiOperation({
    summary: 'Get Malaysian states',
    description: 'Retrieve a list of all Malaysian states with their codes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Malaysian states retrieved successfully',
    type: StatesListResponseDto,
  })
  async getMalaysianStates(): Promise<StatesListResponseDto> {
    return this.configurationsService.getMalaysianStates();
  }

  @Get('countries')
  @Public()
  @ApiOperation({
    summary: 'Get countries with ranking',
    description:
      'Retrieve a list of all countries with their ranking (Malaysia = 1, China = 2, followed by Asian countries, then rest of the world)',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description:
      'Filter countries by region (Asia, Europe, North America, South America, Africa, Oceania)',
    enum: [
      'Asia',
      'Europe',
      'North America',
      'South America',
      'Africa',
      'Oceania',
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Countries retrieved successfully',
    type: CountriesListResponseDto,
  })
  async getCountries(
    @Query('region') region?: string,
  ): Promise<CountriesListResponseDto> {
    if (region) {
      return this.configurationsService.getCountriesByRegion(region);
    }
    return this.configurationsService.getCountries();
  }
}
