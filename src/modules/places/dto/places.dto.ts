import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutocompleteQueryDto {
  @ApiProperty({
    description: 'Input text for place autocomplete',
    example: 'Kuala Lumpur',
  })
  @IsString()
  @IsNotEmpty()
  input: string;
}

export class PlaceDetailsQueryDto {
  @ApiProperty({
    description: 'Google Places place ID',
    example: 'ChIJr-TXXXXXXXXXXXXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  place_id: string;
}

export interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface AutocompleteResponseDto {
  predictions: AutocompletePrediction[];
  status: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface PlaceDetailsResult {
  formatted_address: string;
  name: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface PlaceDetailsResponseDto {
  result: PlaceDetailsResult;
  status: string;
}
