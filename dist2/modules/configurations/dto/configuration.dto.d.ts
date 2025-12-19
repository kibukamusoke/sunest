export declare class StateResponseDto {
    code: string;
    state: string;
}
export declare class CountryResponseDto {
    code: string;
    name: string;
    ranking: number;
    region: string;
}
export declare class StatesListResponseDto {
    states: StateResponseDto[];
}
export declare class CountriesListResponseDto {
    countries: CountryResponseDto[];
}
