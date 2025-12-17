import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import {
  AutocompleteQueryDto,
  PlaceDetailsQueryDto,
  AutocompleteResponseDto,
  PlaceDetailsResponseDto,
} from './dto/places.dto';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  private readonly logger = new Logger(PlacesController.name);

  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get place autocomplete suggestions' })
  @ApiQuery({
    name: 'input',
    description: 'Input text for autocomplete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Autocomplete suggestions retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing or invalid input',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAutocomplete(
    @Query() query: AutocompleteQueryDto,
  ): Promise<AutocompleteResponseDto> {
    try {
      const result = await this.placesService.getAutocomplete(query.input);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logError('Failed to fetch autocomplete suggestions', error);

      throw new HttpException(
        'Failed to fetch autocomplete suggestions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('details')
  @ApiOperation({ summary: 'Get place details by place ID' })
  @ApiQuery({
    name: 'place_id',
    description: 'Google Places place ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Place details retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing or invalid place_id',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getPlaceDetails(
    @Query() query: PlaceDetailsQueryDto,
  ): Promise<PlaceDetailsResponseDto> {
    try {
      const result = await this.placesService.getPlaceDetails(query.place_id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logError('Failed to fetch place details', error);

      throw new HttpException(
        'Failed to fetch place details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private logError(context: string, error: unknown): void {
    if (error instanceof Error) {
      this.logger.error(`${context}: ${error.message}`, error.stack);
    } else {
      let serialized = '';
      try {
        serialized = JSON.stringify(error);
      } catch {
        serialized = String(error);
      }
      this.logger.error(`${context}: ${serialized}`);
    }
  }
}
