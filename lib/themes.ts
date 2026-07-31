export interface Theme {
  key: string;
  name: string;
  primary: string;
  primaryDark: string;
  accent: string;
  navy: string;
  cream: string;
  blush: string;
}

export const THEMES: Record<string, Theme> = {
  rose: {
    key: 'rose',
    name: 'Rose & Gold',
    primary: '#B07D6E',
    primaryDark: '#8B5E52',
    accent: '#D4AF7A',
    navy: '#2C2C3E',
    cream: '#FDFAF7',
    blush: '#F5EAE4',
  },
  sage: {
    key: 'sage',
    name: 'Sage & Cream',
    primary: '#7A9E8A',
    primaryDark: '#5C7D6A',
    accent: '#C9A66B',
    navy: '#2C3E36',
    cream: '#FAFAF5',
    blush: '#E8F0EC',
  },
  navy: {
    key: 'navy',
    name: 'Navy & Burgundy',
    primary: '#7B2D3E',
    primaryDark: '#5A1F2C',
    accent: '#C9A24B',
    navy: '#1B2A4A',
    cream: '#F7F6F3',
    blush: '#E8E4E0',
  },
  blush: {
    key: 'blush',
    name: 'Blush & Blue',
    primary: '#C98BA3',
    primaryDark: '#A66783',
    accent: '#8AA9C9',
    navy: '#3A2E3D',
    cream: '#FDF8F9',
    blush: '#F5E6EC',
  },
};

export function getTheme(themeKey?: string | null): Theme {
  return THEMES[themeKey || 'rose'] || THEMES.rose;
}
