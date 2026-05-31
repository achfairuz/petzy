export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface RegisterRequestDto {
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequestDto {
    refresh_token: string;
}

export interface TokensDto {
    access_token: string;
    refresh_token: string;
    token_type: string;
    access_expires_in: string;
    refresh_expires_in: string;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    profile_picture_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthDataDto {
    user?: UserDto;   // only present on login & register
    tokens: TokensDto;
}

// Generic API envelope returned by backend
export interface ApiResponse<T> {
    success: boolean;
    status_code: number;
    status: string;
    message: string;
    data: T;
    timestamp: string;
}

export type AuthResponseDto = ApiResponse<AuthDataDto>;
