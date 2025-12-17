import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AutocompleteResponseDto,
  PlaceDetailsResponseDto,
} from './dto/places.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.httpClient = axios.create({
      baseURL: 'https://places.googleapis.com/v1',
      timeout: 5000,
    });
  }

  async getAutocomplete(input: string): Promise<AutocompleteResponseDto> {
    const apiKey = this.resolveApiKey();

    try {
      const response = await this.httpClient.post(
        '/places:autocomplete',
        {
          input,
          languageCode: 'en',
          regionCode: 'MY',
        },
        {
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
        },
      );

      const suggestions = response.data?.suggestions ?? [];

      const predictions = suggestions
        .map((suggestion) => suggestion?.placePrediction)
        .filter(Boolean)
        .map((prediction) => {
          const mainText = prediction.structuredFormat?.mainText?.text;
          const secondaryText =
            prediction.structuredFormat?.secondaryText?.text;
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
    } catch (error) {
      this.logError('Error fetching autocomplete suggestions', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw this.toHttpException(
        error,
        'Failed to fetch autocomplete suggestions',
      );
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponseDto> {
    const apiKey = this.resolveApiKey();

    try {
      const response = await this.httpClient.get(
        `/places/${encodeURIComponent(placeId)}`,
        {
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
        },
      );

      const result = response.data;

      if (!result) {
        const message = 'Google Places Details request returned no data';
        this.logger.warn(`Place details request failed: ${message}`);
        throw new BadRequestException(message);
      }

      return {
        result: {
          formatted_address: result.formattedAddress || '',
          name: result.displayName?.text || '',
          address_components:
            result.addressComponents?.map((component) => ({
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
    } catch (error) {
      this.logError('Error fetching place details', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw this.toHttpException(error, 'Failed to fetch place details');
    }
  }

  private resolveApiKey(): string {
    const apiKey =
      this.configService.get<string>('GOOGLE_MAPS_API_KEY') ||
      this.configService.get<string>('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');

    if (!apiKey) {
      this.logger.error(
        'Google Maps API key is not configured. Set GOOGLE_MAPS_API_KEY (or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) in the environment.',
      );
      throw new ServiceUnavailableException(
        'Google Maps integration is not configured',
      );
    }

    return apiKey;
  }

  private logError(message: string, error: unknown): void {
    if (error instanceof Error) {
      this.logger.error(`${message}: ${error.message}`, error.stack);
      if (axios.isAxiosError(error) && error.response?.data) {
        let serialized = '';
        try {
          serialized = JSON.stringify(error.response.data);
        } catch {
          serialized = String(error.response.data);
        }
        this.logger.error(`${message} - Google response: ${serialized}`);
      }
    } else {
      let serialized = '';
      try {
        serialized = JSON.stringify(error);
      } catch {
        serialized = String(error);
      }
      this.logger.error(`${message}: ${serialized}`);
    }
  }

  private toHttpException(
    error: unknown,
    fallbackMessage: string,
  ): HttpException {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const googleMessage =
        error.response?.data?.error_message ||
        error.response?.data?.status ||
        error.message ||
        fallbackMessage;

      if (statusCode && statusCode >= 400 && statusCode < 500) {
        return new HttpException(googleMessage, statusCode);
      }

      return new ServiceUnavailableException(googleMessage);
    }

    return new ServiceUnavailableException(fallbackMessage);
  }
}
