export const Colors = {
    // Primary Colors
    primary: '#ff6464',
    primaryDark: '#ff8D4D',

    // Secondary Colors
    secondary: '#ffBA69',
    secondaryDark: '#5A2828',

    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    border: '#E0E0E0',

    // Text Colors
    textPrimary: '#1A1A1A',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    textOnPrimary: '#FFFFFF',

    // Status Colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',

    // Transparent
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKeys = keyof typeof Colors;
