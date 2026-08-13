export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  heading: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  subheading: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  metadata: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
} as const;

export const componentSizes = {
  buttonHeight: 48,
  buttonHeightSm: 40,
  inputHeight: 48,
  iconButton: 44,
  tabBarHeight: 56,
} as const;

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderSubtle: '#F3F4F6',
  accent: '#2563EB',
  accentMuted: '#EFF6FF',
  success: '#059669',
  successMuted: '#ECFDF5',
  warning: '#D97706',
  warningMuted: '#FFFBEB',
  error: '#DC2626',
  errorMuted: '#FEF2F2',
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;

export const darkColors = {
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceElevated: '#222633',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#6B7280',
  border: '#2D3344',
  borderSubtle: '#1F2433',
  accent: '#3B82F6',
  accentMuted: '#1E3A5F',
  success: '#10B981',
  successMuted: '#064E3B',
  warning: '#F59E0B',
  warningMuted: '#78350F',
  error: '#EF4444',
  errorMuted: '#7F1D1D',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorScheme = typeof lightColors;
