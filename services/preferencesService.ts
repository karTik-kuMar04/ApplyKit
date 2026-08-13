import AsyncStorage from '@react-native-async-storage/async-storage';
import { delay } from '@/utils';
import type { ServiceResult, UserPreferences } from '@/types';

const PREFS_KEY = '@career_os/preferences';

const defaultPreferences: UserPreferences = {
  themeMode: 'system',
  defaultCoverLetterTemplateId: 'cl-1',
  defaultEmailTemplateId: 'em-1',
  autoSyncResume: true,
};

let preferences: UserPreferences = { ...defaultPreferences };

export const preferencesService = {
  async getPreferences(): Promise<ServiceResult<UserPreferences>> {
    await delay(200);
    try {
      const stored = await AsyncStorage.getItem(PREFS_KEY);
      if (stored) {
        preferences = { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch {
      // Use defaults
    }
    return { success: true, data: { ...preferences } };
  },

  async updatePreferences(
    updates: Partial<UserPreferences>
  ): Promise<ServiceResult<UserPreferences>> {
    await delay(300);
    preferences = { ...preferences, ...updates };
    try {
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch {
      return {
        success: false,
        error: { message: "Couldn't save your preferences." },
      };
    }
    return { success: true, data: { ...preferences } };
  },

  reset() {
    preferences = { ...defaultPreferences };
  },
};
