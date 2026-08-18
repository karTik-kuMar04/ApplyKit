import { Linking, Platform, Share } from 'react-native';
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
          message:
            error.response?.data?.error ||
            error.message ||
            "Couldn't load your resume. Check your connection and try again.",
        },
      };
    }
  },

  async getResumeUrl(download?: boolean | string): Promise<ServiceResult<{ url: string }>> {
    try {
      const res = await api.get<{ url: string }>('/api/resume/url', {
        params: download !== undefined ? { download } : undefined,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message:
            error.response?.data?.error ||
            error.message ||
            "Couldn't retrieve resume download URL.",
        },
      };
    }
  },

  async downloadResume(filename?: string): Promise<ServiceResult<{ success: boolean }>> {
    try {
      const downloadName = filename || 'resume.pdf';
      const urlRes = await this.getResumeUrl(downloadName);
      if (!urlRes.success || !urlRes.data.url) {
        return {
          success: false,
          error: {
            message: urlRes.success
              ? 'No download URL returned'
              : urlRes.error.message,
          },
        };
      }

      const url = urlRes.data.url;

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          // Fetch as blob to guarantee immediate file download to user's downloads folder
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch file for download');
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = downloadName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          return { success: true, data: { success: true } };
        } catch {
          // Fallback: direct anchor trigger
          const link = document.createElement('a');
          link.href = url;
          link.download = downloadName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return { success: true, data: { success: true } };
        }
      } else {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return { success: true, data: { success: true } };
        } else {
          return {
            success: false,
            error: { message: 'Unable to trigger download on this device.' },
          };
        }
      }
    } catch (err: any) {
      return {
        success: false,
        error: { message: err.message || 'Failed to download PDF.' },
      };
    }
  },

  async openResume(): Promise<ServiceResult<{ url: string }>> {
    const urlResult = await this.getResumeUrl();
    if (!urlResult.success || !urlResult.data.url) {
      return {
        success: false,
        error: {
          message: urlResult.success ? 'No URL returned' : urlResult.error.message,
        },
      };
    }

    try {
      const { url } = urlResult.data;
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        await Linking.openURL(url);
      }
      return { success: true, data: { url } };
    } catch (err: any) {
      return {
        success: false,
        error: { message: err.message || 'Could not open PDF viewer.' },
      };
    }
  },

  async syncResume(): Promise<ServiceResult<Resume>> {
    return this.getResume();
  },

  async shareResume(): Promise<ServiceResult<{ message: string; url?: string }>> {
    const urlResult = await this.getResumeUrl();
    if (urlResult.success && urlResult.data.url) {
      const { url } = urlResult.data;
      try {
        if (Platform.OS === 'web') {
          if (typeof navigator !== 'undefined' && navigator.share) {
            await navigator.share({
              title: 'Resume',
              url,
            });
            return { success: true, data: { message: 'Resume shared.', url } };
          }
          window.open(url, '_blank', 'noopener,noreferrer');
          return { success: true, data: { message: 'Resume opened.', url } };
        } else {
          await Share.share({
            title: 'Resume',
            url,
            message: `Here is my resume: ${url}`,
          });
          return { success: true, data: { message: 'Resume shared.', url } };
        }
      } catch (e: any) {
        return { success: true, data: { message: 'Resume link ready.', url } };
      }
    }
    return {
      success: false,
      error: { message: "Couldn't get resume link." },
    };
  },
};
