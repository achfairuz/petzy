export const ENV = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.petzy.local',
    API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 15000),
    EMULATOR: process.env.EXPO_PUBLIC_EMULATOR === 'true',
    // Toggle to false once a real backend is ready.
    MOCK_API: (process.env.EXPO_PUBLIC_MOCK_API ?? 'true') === 'true',
} as const;
