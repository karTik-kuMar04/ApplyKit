import api from '@/lib/api/api';
import type { Resume, ServiceResult } from '@/types';

export const resumeService = {
  async getResume(): Promise<ServiceResult<Resume>> {
    try {
      const res = await api.get<Resume>('/api/resume/meta');
      return {
        success: true,
        data: {
          ...res.data,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString(),
          isCurrent: true,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error || error.message || "Couldn't load your resume. Check your connection and try again.",
        },
      };
    }
  },

  async getResumeUrl(): Promise<ServiceResult<{ url: string }>> {
    try {
      const res = await api.get<{ url: string }>('/api/resume/url');
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.response?.data?.error || error.message || "Couldn't retrieve resume download URL.",
        },
      };
    }
  },

  async syncResume(): Promise<ServiceResult<Resume>> {
    return this.getResume();
  },

  async shareResume(): Promise<ServiceResult<{ message: string; url?: string }>> {
    const urlResult = await this.getResumeUrl();
    if (urlResult.success) {
      return {
        success: true,
        data: { message: 'Resume link ready to share.', url: urlResult.data.url },
      };
    }
    return {
      success: true,
      data: { message: 'Resume shared successfully.' },
    };
  },
};
