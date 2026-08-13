import { mockResume } from '@/mock/resume';
import { delay, generateId, simulateRandomFailure } from '@/utils';
import type { Resume, ServiceResult, SyncStatus } from '@/types';

let currentResume: Resume = { ...mockResume };
let forceOffline = false;
let forceSyncFail = false;

export const resumeService = {
  async getResume(): Promise<ServiceResult<Resume>> {
    await delay(600);
    if (forceOffline) {
      return {
        success: true,
        data: { ...currentResume, syncStatus: 'offline' },
      };
    }
    if (simulateRandomFailure(0.02)) {
      return {
        success: false,
        error: { message: "Couldn't load your resume. Check your connection and try again." },
      };
    }
    return { success: true, data: { ...currentResume } };
  },

  async syncResume(): Promise<ServiceResult<Resume>> {
    currentResume = { ...currentResume, syncStatus: 'syncing' };
    await delay(2000);

    if (forceSyncFail || simulateRandomFailure(0.08)) {
      currentResume = { ...currentResume, syncStatus: 'failed' };
      return {
        success: false,
        error: { message: "Couldn't sync your resume. Your cached copy is still available." },
      };
    }

    if (forceOffline) {
      currentResume = { ...currentResume, syncStatus: 'offline' };
      return {
        success: true,
        data: { ...currentResume },
      };
    }

    const now = new Date().toISOString();
    currentResume = {
      ...currentResume,
      syncStatus: 'synced' as SyncStatus,
      lastSyncedAt: now,
      updatedAt: now,
    };
    return { success: true, data: { ...currentResume } };
  },

  async shareResume(): Promise<ServiceResult<{ message: string }>> {
    await delay(400);
    return {
      success: true,
      data: { message: 'Resume shared successfully.' },
    };
  },

  setForceOffline(value: boolean) {
    forceOffline = value;
  },

  setForceSyncFail(value: boolean) {
    forceSyncFail = value;
  },

  reset() {
    currentResume = { ...mockResume };
    forceOffline = false;
    forceSyncFail = false;
  },
};
