import { ApiProperty } from '@nestjs/swagger';

export class StateResponseDto {
  @ApiProperty({
    description: 'State code',
    example: '01',
  })
  code: string;

  @ApiProperty({
    description: 'State name',
    example: 'Johor',
  })
  state: string;
}

export class CountryResponseDto {
  @ApiProperty({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'MY',
  })
  code: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Malaysia',
  })
  name: string;

  @ApiProperty({
    description: 'Country ranking (1 = highest priority)',
    example: 1,
  })
  ranking: number;

  @ApiProperty({
    description: 'Country region',
    example: 'Asia',
  })
  region: string;
}

export class StatesListResponseDto {
  @ApiProperty({
    description: 'List of Malaysian states',
    type: [StateResponseDto],
  })
  states: StateResponseDto[];
}

export class CountriesListResponseDto {
  @ApiProperty({
    description: 'List of countries with ranking',
    type: [CountryResponseDto],
  })
  countries: CountryResponseDto[];
}
