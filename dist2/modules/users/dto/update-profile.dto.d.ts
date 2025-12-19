export declare class UpdateProfileDto {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    jobTitle?: string;
    department?: string;
    avatar?: string;
    idType?: 'NRIC' | 'BRN' | 'PASSPORT' | 'ARMY';
    idValue?: string;
}
